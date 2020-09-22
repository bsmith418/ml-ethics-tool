import {Injectable} from '@angular/core';
import {AngularFirestore, CollectionReference, DocumentReference, Query} from '@angular/fire/firestore';
import {BehaviorSubject, combineLatest, concat, Observable, of} from 'rxjs'; // is correct/current despite deprecation flag
import {DataType, DevStage, EnumToProperty, MLCategory, Objective, PromotedValue, Strategy} from './intervention.model';
import {delay, map, switchMap} from 'rxjs/operators';
import {AuthService} from './auth.service';

import { firestore } from 'firebase/app';



export interface EditObj{
  originalName: string;
  originalID: string;
}

interface ArrayFilter{
  arrayName: string;
  containsAnyOf: string[];
}

@Injectable({
  providedIn: 'root'
})
export class InterventionsService {

  // Need to separate firestore / master observable from subscribable observable
  // otherwise we would have multiple live query objects: one for each subscriber (e.g. whenever async pipe is called in a template)
  private _filteredStrategiesMaster$: Observable<Strategy[]|null>;
  private _filteredStrategies$: BehaviorSubject<Strategy[]|null>;
  public filteredStrategies$: Observable<Strategy[]|null>;
  public filteredStrategies: Strategy[] = [];

  public totalModQueue$: Observable<number>;

  private _newStrategiesMaster$: Observable<Strategy[]|null>;
  private _newStrategies$: BehaviorSubject<Strategy[]|null>;
  public newStrategies$: Observable<Strategy[]|null>;
  private _newStrategiesCount$: BehaviorSubject<number>;
  public newStrategiesCount$: Observable<number>;

  private _editStrategiesMaster$: Observable<EditObj[]|null>;
  private _editStrategies$: BehaviorSubject<EditObj[]|null>;
  public editStrategies$: Observable<EditObj[]|null>;
  private _editStrategiesCount$: BehaviorSubject<number>;
  public editStrategiesCount$: Observable<number>;


  private _deleteStrategiesMaster$: Observable<Strategy[]|null>;
  private _deleteStrategies$: BehaviorSubject<Strategy[]|null>;
  public deleteStrategies$: Observable<Strategy[]|null>;
  private _deleteStrategiesCount$: BehaviorSubject<number>;
  public deleteStrategiesCount$: Observable<number>;

  // TODO: don't expose behaviorSubjects; create methods to change these, and use asObservable() pattern above
  public objectivesFilter$: BehaviorSubject<string[]|null>;
  public devStageFilter$: BehaviorSubject<string[]|null>;
  public dataTypeFilter$: BehaviorSubject<string[]|null>;
  public promotedValuesFilter$: BehaviorSubject<string[]|null>;
  public mlCategoriesFilter$: BehaviorSubject<string[]|null>;
  public searchTerms$: BehaviorSubject<string[]|null>;

  // private publicStrategyCollectionName = 'interventionsTest';
  private publicStrategyCollectionName = 'liveStrategies';
  private newStrategiesName = 'newStrategies';
  private editStrategiesName = 'editStrategies';
  private deleteStrategiesCollectionName = 'deleteStrategies';


  suggestNewStrategy(strategy: Strategy): Promise<DocumentReference>{
    delete strategy.id;
    return this.ngFirestore.collection(this.newStrategiesName).add(strategy);
    // return this.firestore.collection(this.strategyFirestoreCollectionName).add(intervention);
  }
  async approveNewStrategy(strategy: Strategy): Promise<void>{
    // to safely execute multiple CRUDs at once, use firestore transactions if reads are necessary; otherwise, use batches
    // delete strategy from newStrategy collection and add it to the public collection
    strategy.needsSearchProperties = true;
    const batch = this.ngFirestore.firestore.batch();
    const queuedDoc: DocumentReference = this.ngFirestore.collection(this.newStrategiesName).doc(strategy.id).ref;
    batch.delete(queuedDoc);
    const freshID = this.ngFirestore.createId();
    const newDoc: DocumentReference = this.ngFirestore.collection(this.publicStrategyCollectionName).doc(freshID).ref;
    delete strategy.id;
    batch.set(newDoc, strategy);
    return batch.commit();
  }
  rejectNewStrategy(intervention: Strategy): Promise<void>{
    return this.ngFirestore.doc(`${this.newStrategiesName}/${intervention.id}`).delete();
  }

  suggestEdit(editObj: EditObj): Promise<DocumentReference>{
    return this.ngFirestore.collection(this.editStrategiesName).add(editObj);
  }

  rejectEdit(editObj: EditObj, property: string): Promise<void> {
    // delete offending fields from editObj
    // if editObj contains no more edits, delete the entire doc

    const editObjID = (editObj as any).id;
    if (this.editObjIsReadyForDeletion(editObj)){
      return this.ngFirestore.doc(`${this.editStrategiesName}/${editObjID}`).delete();
    } else {
      // delete the offending fields
      editObj[property] = firestore.FieldValue.delete();
      editObj[`${property}ORIGINAL`] = firestore.FieldValue.delete();
      return this.ngFirestore.doc(`${this.editStrategiesName}/${editObjID}`).update(editObj);

    }
    return null;
  }

  editObjIsReadyForDeletion(editObj: EditObj): boolean{
    // an empty editObj has three properties: originalName, originalID, and the tacked on firestore doc id
    // an editObj with five properties has only one edit remaining, with fields for the original and proposed values
    // thus, a rejected EditObj with five properties should be deleted
    return Object.keys(editObj).length === 5;
  }

  acceptEdit(editObj: EditObj, property: string): Promise<void> {
    const editObjID = (editObj as any).id;
    const originalID = editObj.originalID;
    // run batch, updating field in public strategy, and either removing fields from or fully deleting editObj

    const publicDoc: DocumentReference = this.ngFirestore.collection(this.publicStrategyCollectionName).doc(originalID).ref;
    const editDoc: DocumentReference = this.ngFirestore.collection(this.editStrategiesName).doc(editObjID).ref;
    const updateObj = {}; // simple object with which to update the public doc
    updateObj[property] = editObj[property];
    (updateObj as any).needsSearchProperties = true; // instigate the generation of new search terms / properties

    const batch = this.ngFirestore.firestore.batch();
    batch.update(publicDoc, updateObj);
    if (this.editObjIsReadyForDeletion(editObj)){
      batch.delete(editDoc);
    } else {
      editObj[property] = firestore.FieldValue.delete();
      editObj[`${property}ORIGINAL`] = firestore.FieldValue.delete();
      batch.set(editDoc, editObj, {merge: true}); // merge true allows the FieldValue deletions to execute
    }
    return batch.commit();
  }


   getWordsArrayFromText(text: string): string[]{
    if ( text === null || text === '' ){
      return [];
    }
    const wholeWordsPattern: RegExp = /\w+/g;
    const regArray: RegExpMatchArray| null = text.match(wholeWordsPattern);
    let words = regArray?.map((word) => word.toLowerCase());
    // make a set in order to remove duplicates
    const deDuped = new Set(words);
    words = Array.from(deDuped);
    return words;
  }



  getDeletionId(strategy: Strategy): string{
    // 'deleteID' is an appended property by specified by the observable in the constructor
    return (strategy as any).deleteID;
  }

  requestDelete(strategy: Strategy): Promise<DocumentReference>{
    return this.ngFirestore.collection(this.deleteStrategiesCollectionName).add(strategy);
  }


  acceptDeletion(strategy: Strategy): Promise<void> {
    // batch: delete both the request and the offending live document
    // if the offending document is already deleted, fail gracefully
    const publicDoc: DocumentReference = this.ngFirestore.collection(this.publicStrategyCollectionName).doc(strategy.id).ref;
    const deletionDoc: DocumentReference =
      this.ngFirestore.collection(this.deleteStrategiesCollectionName).doc(this.getDeletionId(strategy)).ref;
    const batch = this.ngFirestore.firestore.batch();
    batch.delete(deletionDoc);
    batch.delete(publicDoc);
    return batch.commit();
  }
  rejectDeletion(strategy: Strategy): Promise<void> {
    return this.ngFirestore.doc(`${this.deleteStrategiesCollectionName}/${this.getDeletionId(strategy)}`).delete();
  }



  // Understand firestore queries (https://firebase.google.com/docs/firestore/query-data/queries#limitations)
  //
  // simple comparisons:
  // citiesRef.where("state", "==", "CA");
  // citiesRef.where("population", "<", 100000)
  //
  // in:
  // citiesRef.where('country', 'in', ['USA', 'Japan']);
  // => doc's country field must be either USA or Japan
  //
  // array-contains:
  // citiesRef.where("regions", "array-contains", "west_coast")
  // => doc's regions array must contain west_coast
  //
  // array-contains-any:
  // citiesRef.where('regions', 'array-contains-any',['west_coast', 'east_coast']);
  // => doc's regions array must contain either west_coast, east_coast, or both
  //
  //   LIMITATIONS:
  //   in and array-contains-any support up to 10 comparison values.
  //   You can use only one in or array-contains-any  [or array-contains] clause per query.
  //   You can't use both in and array-contains-any in the same query.
  //   You can combine array-contains with in but not with array-contains-any.
  //   You cannot order your query by any field included in an equality (=) or in clause.
  //
  //   distilled limitations: you can only use one fancy filter, more or less, per query. the rest must be simple.
  //   THUSLY, for enum-type filters, it's best to spread them out into separate fields on the Firestore doc, and do simple boolean checks


  // append a filter for each supplied property
  getQueryFilter(query: Query, filterEnumKeys: string[]): Query{
    filterEnumKeys.forEach((enumKey) => {
      query = query.where(enumKey, '==', true);
    });
    return query;
  }


  constructor(private ngFirestore: AngularFirestore, private auth: AuthService) {

    this._filteredStrategies$ = new BehaviorSubject(null);
    this.filteredStrategies$ = this._filteredStrategies$?.asObservable();

    this._newStrategies$ = new BehaviorSubject(null);
    this.newStrategies$ = this._newStrategies$?.asObservable();
    this._newStrategiesCount$ = new BehaviorSubject<number>(0);
    this.newStrategiesCount$ = this._newStrategiesCount$.asObservable();


    this._editStrategies$ = new BehaviorSubject(null);
    this.editStrategies$ = this._editStrategies$?.asObservable();
    this._editStrategiesCount$ = new BehaviorSubject<number>(0);
    this.editStrategiesCount$ = this._editStrategiesCount$.asObservable();

    this._deleteStrategies$ = new BehaviorSubject(null);
    this.deleteStrategies$ = this._deleteStrategies$?.asObservable();
    this._deleteStrategiesCount$ = new BehaviorSubject<number>(0);
    this.deleteStrategiesCount$ = this._deleteStrategiesCount$.asObservable();

    this.objectivesFilter$ = new BehaviorSubject(null);
    this.devStageFilter$ = new BehaviorSubject(null);
    this.dataTypeFilter$ = new BehaviorSubject(null);
    this.promotedValuesFilter$ = new BehaviorSubject(null);
    this.mlCategoriesFilter$ = new BehaviorSubject(null);
    this.searchTerms$ = new BehaviorSubject(null);


    this.totalModQueue$ = combineLatest(
      [
        this.newStrategiesCount$,
        this._editStrategiesCount$,
        this._deleteStrategiesCount$
      ]
    ).pipe(
      map(
        ([newCount, editCount, deleteCount]) => {
          return newCount + editCount + deleteCount;
        }
      )
    );

    // TODO: infinite scroll / pagination. Monitor all filter observables and a scroll observable as a single stream
    // if a filter observable appears, set pagination index to 0
    // if a scroll observable appears, increase pagination index by 1
    // make the _filteredStrategiesMaster$ monitor the pagination observable as another combineLatest
    // and make it fetch the page accordingly, pushing to array instead of overwriting if pagination index > 0
    // perhaps make _filteredStrategiesMaster$ primarily contingent on the non-combineLatest pagination+filters stream
    //    to avoid double-triggering it when a filter is changed


    // const delayed = new Observable().pipe(delay(700));
    const delayed = of([new Strategy()]).pipe(delay(2000));

    // combineLatest creates an array of the latest values from all provided observables
    // good overview of different rxjs map things
    // https://stackoverflow.com/questions/51171194/angular-5-rxjs-concatmap-switchmap-mergemap-which

    this._filteredStrategiesMaster$ = combineLatest([
      this.objectivesFilter$,
      this.devStageFilter$,
      this.dataTypeFilter$,
      this.promotedValuesFilter$,
      this.mlCategoriesFilter$,
      this.searchTerms$
      ]
    ).pipe(
        switchMap(([
          objectives,
          devStages,
          dataTypes,
          promotedValues,
          mlCategories,
          searchTerms
                   ]) =>
          concat(
            of( [ new Strategy(), ...(this.filteredStrategies as Strategy[]) ] as Strategy[] ), // trigger progress spinner w/empty Strategy
            // delayed,  // uncomment to simulate a very slow connection
            combineLatest(
              // create separate queries for each search term and combine them all
              // e.g. "python fairness" => separate queries for "python" and "fairness"
              (searchTerms ? searchTerms : [null]).map((searchTerm) => {
                return ngFirestore.collection<Strategy>(this.publicStrategyCollectionName, ref => {
                  // console.log(`new query: ${searchTerm}`);
                  let query: Query = ref;
                  if (objectives) { query = this.getQueryFilter(query, objectives); }
                  if (devStages) { query = this.getQueryFilter(query, devStages); }
                  if (dataTypes) { query = this.getQueryFilter(query, dataTypes); }
                  if (promotedValues) { query = this.getQueryFilter(query, promotedValues); }
                  if (mlCategories) { query = this.getQueryFilter(query, mlCategories); }
                  if (searchTerm) { query = query.where('wordsArray', 'array-contains', searchTerm); }
                  return query;
                }).valueChanges({idField: 'id'});
              }),
            ).pipe(
              // redundantResultsArray == an array of arrays of strategies
              map((redundantResultsArray) => {
                // map all results onto an object by their id values, to eliminate redundancy
                const resultsObj = {};
                redundantResultsArray.forEach((queryResults) =>
                  queryResults.forEach((strategy) => {
                    resultsObj[strategy.id] = strategy;
                  })
                );
                this.filteredStrategies = Object.values(resultsObj) as Strategy[];
                return this.filteredStrategies;
              }
              )
            )
          )
        ),
    );

    // a single subscription to avoid multiple database connections
    this._filteredStrategiesMaster$.subscribe((next) => {
      this._filteredStrategies$.next(next);
    });


    this._newStrategiesMaster$ = auth.isAdmin$.pipe(
      switchMap((isAdmin, index) => {
        if (isAdmin){
          return ngFirestore.collection<Strategy>(this.newStrategiesName).valueChanges({idField: 'id'});
        } else {
          return [];
        }
      })
    );

    this._newStrategiesMaster$.subscribe((strategies) => {
      this._newStrategiesCount$.next(strategies.length);
      // console.log(`got a ${strategies.length} up in here`);
      this._newStrategies$.next(strategies);
    });

    this._editStrategiesMaster$ = auth.isAdmin$.pipe(
      switchMap((isAdmin, index) => {
        if (isAdmin){
          return ngFirestore.collection<EditObj>(this.editStrategiesName).valueChanges({idField: 'id'});
        } else {
          return [];
        }
      })
    );

    this._editStrategiesMaster$.subscribe((strategies) => {
      this._editStrategiesCount$.next(strategies.length);
      // console.log(`got a ${strategies.length} up in here`);
      this._editStrategies$.next(strategies);
    });

    this._deleteStrategiesMaster$ = auth.isAdmin$.pipe(
      switchMap((isAdmin, index) => {
        if (isAdmin){
          return ngFirestore.collection<Strategy>(this.deleteStrategiesCollectionName).valueChanges({idField: 'deleteID'});
        } else {
          return [];
        }
      })
    );

    this._deleteStrategiesMaster$.subscribe((strategies) => {
      this._deleteStrategiesCount$.next(strategies.length);
      // console.log(`got a ${strategies.length} up in here`);
      this._deleteStrategies$.next(strategies);
    });



    // TODO: grab+set initial filters from query params of URL
  }

}
