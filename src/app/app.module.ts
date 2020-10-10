import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// import AngularFire + its config from environment
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';

// import used AngularFire modules
import {AngularFireAuth, AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreModule} from '@angular/fire/firestore';

import {FormsModule, NgModelGroup, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { ListerComponent } from './lister/lister.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginComponent } from './login/login.component';
import { LimitTextPipe } from './limit-text.pipe';
import { ShortEmailPipe } from './short-email.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {HttpClientModule} from '@angular/common/http';
import { InterventionFormComponent } from './intervention-form/intervention-form.component';


import {MatCardModule} from '@angular/material/card';
import { InterventionsViewerComponent } from './interventions-viewer/interventions-viewer.component';
import { ControlsComponent } from './controls/controls.component';


import {MatDialogModule} from '@angular/material/dialog';
import { NewInterventionDialogComponent } from './new-intervention-dialog/new-intervention-dialog.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { LogoutComponent } from './logout/logout.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatTooltipModule} from '@angular/material/tooltip';
import { EditInterventionDialogComponent } from './edit-intervention-dialog/edit-intervention-dialog.component';
import { EnumListComponent } from './enum-list/enum-list.component';
import {MatTabsModule} from '@angular/material/tabs';
import { ConfirmDeleteComponent } from './confirm-delete/confirm-delete.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import { CheckboxListComponent } from './checkbox-list/checkbox-list.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDividerModule} from '@angular/material/divider';
import { UidComponent } from './uid/uid.component';
import { StrategyCardComponent } from './strategy-card/strategy-card.component';
import {MatBadgeModule} from '@angular/material/badge';
import { AddSpacesPipe } from './add-spaces.pipe';
import {MatRadioModule} from '@angular/material/radio';


@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    ListerComponent,
    NotFoundComponent,
    LoginComponent,
    LimitTextPipe,
    ShortEmailPipe,
    InterventionFormComponent,
    InterventionsViewerComponent,
    ControlsComponent,
    NewInterventionDialogComponent,
    LogoutComponent,
    EditInterventionDialogComponent,
    EnumListComponent,
    ConfirmDeleteComponent,
    CheckboxListComponent,
    UidComponent,
    StrategyCardComponent,
    AddSpacesPipe
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
