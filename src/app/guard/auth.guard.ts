import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AngularFirebaseService} from "../counter/angular-firebase.service";
import {AngularFireAuth} from "@angular/fire/compat/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private readonly _PREVIOUS_URL = 'previousUrl';
  private readonly _LOGIN_URL = 'login';

  constructor(private afService: AngularFirebaseService, public router: Router, private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe((user) => {
      this.afService.isLoggedIn = user !== null;
      if (this.afService.isLoggedIn) {
        const previousUrl = localStorage.getItem(this._PREVIOUS_URL);
        this.router.navigate([previousUrl === null ? '/' : previousUrl]);
      } else {
        localStorage.removeItem(this._PREVIOUS_URL);
        this.router.navigate([this._LOGIN_URL]);
      }
    });
  }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.afService.isLoggedIn) {
      localStorage.setItem(this._PREVIOUS_URL, state.url === '/' ? 'home' : state.url);
      this.router.navigate([this._LOGIN_URL]);
    }
    return true;
  }

}
