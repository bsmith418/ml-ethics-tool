import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NewInterventionDialogComponent} from '../new-intervention-dialog/new-intervention-dialog.component';
import {InterventionsService} from '../interventions.service';
import {AuthService} from '../auth.service';
import {LoginComponent} from '../login/login.component';
import {EnumToProperty, DataType, DevStage, Objective, PromotedValue, MLCategory} from '../intervention.model';
import {CheckedBox} from '../checkbox-list/checkbox-list.component';
import {BehaviorSubject, Observable, Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter} from 'rxjs/operators';


export interface Filter{
  title: string;
  isFiltering: boolean;
  // checkboxEvent: (check: CheckedBox) => void;
  subject: BehaviorSubject<string[]>;
  masterEnum: object;
}

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit, OnDestroy {

  filteringObjectives = false;
  filteringDevstages = false;
  filteringDatatypes = false;


  isSearchFiltering: boolean|null = false;


  currentExpansionPanel = 0;

  searchValue = '';
  searchValue$ = new Subject<string>();
  inputSubscription: Subscription;

  filters: Filter[] = [
    {
      title: 'My objective is to',
      isFiltering: false,
      subject: this.interventionService.objectivesFilter$,
      masterEnum: Objective
    },
    {
      title: 'My dev stage is',
      isFiltering: false,
      subject: this.interventionService.devStageFilter$,
      masterEnum: DevStage
    },
    {
      title: 'My training datatype is',
      isFiltering: false,
      subject: this.interventionService.dataTypeFilter$,
      masterEnum: DataType
    },
    {
      title: 'My ethical concern is',
      isFiltering: false,
      subject: this.interventionService.promotedValuesFilter$,
      masterEnum: PromotedValue
    },
    {
      title: 'My ML field is',
      isFiltering: false,
      subject: this.interventionService.mlCategoriesFilter$,
      masterEnum: MLCategory
    }
  ];

  handleCheckboxEvent(filterIndex: number, checkedBox: CheckedBox): void{
    // only one can be selected, so if unchecked, then it's not filtering
    this.filters[filterIndex].isFiltering = checkedBox.isChecked;
    if (checkedBox.isChecked){
      this.filters[filterIndex].subject.next([checkedBox.key]);
    } else {
      this.filters[filterIndex].subject.next(null);
    }
  }

  setPanel(index: number): void {
    this.currentExpansionPanel = index;
  }

  handleSearchTyping(newValue: string): void {
    this.isSearchFiltering = null; // indeterminate state until debounce
    this.searchValue$.next(newValue);
  }

  openDialog(): void {
    if (this.authService.isLoggedIn) {
      const dialogRef = this.dialog.open(NewInterventionDialogComponent, {
      });
    } else {
      this.dialog.open(LoginComponent);
    }
  }

  handleSubmit(input: HTMLInputElement): void {
    input.blur();
    // console.log('submit');
  }

  constructor(
    public dialog: MatDialog,
    public interventionService: InterventionsService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {

    const debouncedSearch: Observable<string> = this.searchValue$
      .pipe(
        // filter(text => text.length > 2), // DON'T filter, since we want to trigger clearing search filter when empty
        debounceTime(500),
        distinctUntilChanged()
      );

    this.inputSubscription = debouncedSearch.subscribe((newRawSearch) => {
      const searchTerms = this.interventionService.getWordsArrayFromText(newRawSearch);
      console.log(`searching for: "${searchTerms}"`);
      if (searchTerms.length > 0) {
        this.isSearchFiltering = true;
        this.interventionService.searchTerms$.next(searchTerms);
      } else {
        this.isSearchFiltering = false;
        this.interventionService.searchTerms$.next(null);
      }
    });
  }

  ngOnDestroy(): void {
    this.inputSubscription.unsubscribe();
  }



}
