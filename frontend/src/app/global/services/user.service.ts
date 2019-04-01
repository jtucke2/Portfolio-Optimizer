import { Injectable } from '@angular/core';

import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public loggedIn = false;
  public user: User;

  public get token() { return this._token; }
  public set token(token: string) {
    this._token = token;
    if (token) {
      localStorage.setItem('jwt', token);
    }
  }
  private _token: string;

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
    if (user.approved) {
      this.loggedIn = true;
    }
  }

  public logout() {
    this.user = null;
    this.token = null;
    this.loggedIn = null;
    localStorage.clear();
  }
}
