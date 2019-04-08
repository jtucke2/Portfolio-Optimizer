import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public loggedIn = false;
  public user: User;

  public get token() { return this._token; }
  public set token(token: string) {
    if (token) {
      if (!this.jwtHelper.isTokenExpired(token)) {
        this._token = token;
        this.loggedIn = true;
        localStorage.setItem('jwt', token);
      } else {
        this.logout();
      }
    }
  }
  private jwtHelper = new JwtHelperService();
  private _token: string = null;

  constructor() {
    const localUser = localStorage.getItem('user');
    if (localUser) {
      this.setUser(JSON.parse(localUser));
    }
    const token = localStorage.getItem('jwt');
    if (token) {
      this.token = token;
    }
  }

  public setUser(user: User) {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  public logout() {
    this.user = null;
    this.token = null;
    this.loggedIn = null;
    localStorage.clear();
  }
}
