import {Injectable, NgZone} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {User} from 'firebase';
import {BehaviorSubject, Observable} from 'rxjs';
import {AngularFirestore, AngularFirestoreDocument, DocumentData, DocumentSnapshot} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';



interface AdminSettings{
  moderatorUIDs: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: User = null;


  isLoggedIn = false;
  private _isLoggedIn$ = new BehaviorSubject<boolean|null>(null);
  public isLoggedIn$ = this._isLoggedIn$.asObservable();

  private _isAdmin$ = new BehaviorSubject<boolean|null>(null);
  public isAdmin$ = this._isAdmin$.asObservable();

  private _email$;
  public email$: Observable<string>;
  private _uid$;
  public uid$: Observable<string>;
  public uid: string;


  async handleAuthChange(newUser: User): Promise<void> {
    // console.log(`User: ${newUser?.email}`);

    // Angular ngZone patches http XHR request callbacks, and few others, to kick in change detection.
    // But there are many asynchronous operations which are not covered by the ngZone and
    // after successful callback you do not see any updates in UI.
    // To manually run those operations you need to wrap them inside ngZone run() method.
    // https://medium.com/@naveen.kr/rxjs-custom-pipeable-operator-to-run-asynchronous-callbacks-inside-angular-zone-a49bd71c0bf6
    this.ngZone.run( () => {
      this._email$.next(newUser?.email);
      this._uid$.next(newUser?.uid);
      this.uid = newUser?.uid;
      this.user = newUser;
      this.isLoggedIn = !!newUser;
      this._isLoggedIn$.next(this.isLoggedIn);
    });

    try{
      const adminDoc: AngularFirestoreDocument = this.firestore.doc<AdminSettings>('admin/adminSettings');
      const adminSettings: AdminSettings = await adminDoc.get().pipe(
        map( (docData: DocumentSnapshot<DocumentData>) => docData.data() as AdminSettings)
      ).toPromise();

      if (adminSettings.moderatorUIDs.includes(this.uid)){
        // console.log('admin found!!');
        this._isAdmin$.next(true);
      } else {
        // console.log('not admin.');
        this._isAdmin$.next(false);
      }
    } catch (e) {
      // console.log('prob not admin');
      this._isAdmin$.next(false);
    }

    // console.log(`Does Angular see me? ${NgZone.isInAngularZone() ? 'Yes.' : 'No'}`);
  }

  signOut(): void {
    this.authFire.signOut();
  }



  constructor(private authFire: AngularFireAuth, private firestore: AngularFirestore, private ngZone: NgZone) {
    // caution: don't do onAuthStateChanged(youRawFunction). it screws up the "this" scope
    this.authFire.onAuthStateChanged((user) => this.handleAuthChange(user) );
    this._email$ = new BehaviorSubject<string>('Checking login state...');
    this.email$ = this._email$.asObservable();
    this._uid$ = new BehaviorSubject<string>('Checking login state...');
    this.uid$ = this._uid$.asObservable();



  }
}
