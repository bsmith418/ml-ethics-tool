import { NgModule } from '@angular/core';
import {Routes, RouterModule, Route, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

import { AdminComponent } from './admin/admin.component';
import { ListerComponent } from './lister/lister.component';
import { NotFoundComponent } from './not-found/not-found.component';

import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';

import {AuthPipe, canActivate, emailVerified} from '@angular/fire/auth-guard';
import {customClaims, hasCustomClaim, idTokenResult, redirectUnauthorizedTo, redirectLoggedInTo, loggedIn } from '@angular/fire/auth-guard';
import {LoginComponent} from './login/login.component';
import {PathReference} from '@angular/fire/database';
import {UtilityService} from './utility.service';
import {RouterPaths} from './app-routing.paths';
import {InterventionsViewerComponent} from './interventions-viewer/interventions-viewer.component';
import {UidComponent} from './uid/uid.component';

// if unauthorized for /the/desired/path, redirect to /login/the/desired/path
const redirectUnauthorizedToLogin = (desiredRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
  redirectUnauthorizedTo([RouterPaths.login, ... UtilityService.urlToSegments(state.url)]);

// modifying from https://github.com/angular/angularfire/blob/master/src/auth-guard/auth-guard.ts
export const customClaimsOrNull = pipe(idTokenResult, map(idTokenResultz => idTokenResultz ? idTokenResultz.claims : null));

const redirectAnonymousAcceptAdmin = () => pipe(customClaimsOrNull, map(
  claims => !claims ? [RouterPaths.login, RouterPaths.admin] : claims.hasOwnProperty('admin') ? true : ['nopermit']
));

const routes: Routes = [
  { path: RouterPaths.index, component: InterventionsViewerComponent },
  { path: RouterPaths.admin, component: AdminComponent },
  // { path: RouterPaths.admin, component: AdminComponent, ...canActivate(redirectAnonymousAcceptAdmin) },
  // { path: RouterPaths.contribute, component: ContributeComponent, ...canActivate( redirectUnauthorizedToLogin )},
  // { path: RouterPaths.login, component: LoginComponent, children: [ {path: '**', component: LoginComponent} ] },
  { path: RouterPaths.uid, component: UidComponent},
  { path: '**', component: NotFoundComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
