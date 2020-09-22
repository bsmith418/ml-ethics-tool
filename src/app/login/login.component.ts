import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {auth} from 'firebase/app';

import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material/icon';

import UserCredential = firebase.auth.UserCredential;
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    public ngFireAuth: AngularFireAuth,
  ) {

  }

  async loginGoogle(): Promise<any>{
    const user: UserCredential = await this.ngFireAuth.signInWithPopup(new auth.GoogleAuthProvider());
    this.closeDialogIfLoggedIn(user);
  }
  async loginGithub(): Promise<any>{
    const user: UserCredential = await this.ngFireAuth.signInWithPopup(new auth.GithubAuthProvider());
    this.closeDialogIfLoggedIn(user);
  }

  private closeDialogIfLoggedIn(user): void{
    if (!user) {
      return;
    } else {
      this.dialogRef.close();
    }
  }

  ngOnInit(): void {
  }

}
