import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, pluck } from 'rxjs/operators';

import { ApiService } from './api.service';
import { User } from 'src/app/models/user';
import { UserService } from './user.service';

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirm: string;
}

export interface RegisterReturnData {
  user: User;
  message?: string | null;
}

export interface LoginReturnData extends RegisterReturnData {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = '/api/user';

  constructor(private apiService: ApiService, private userService: UserService) { }

  public register(userData: RegisterData): Observable<RegisterReturnData> {
    return this.apiService.post(`${this.baseUrl}/register`, userData)
      .pipe(
        tap((dat) => dat.user ? this.userService.setUser(dat.user) : null)
      );
  }

  public login(loginData: { email: string, password: string }): Observable<LoginReturnData> {
    return this.apiService.post(`${this.baseUrl}/login`, loginData)
      .pipe(
        tap((dat) => dat.user ? this.userService.setUser(dat.user) : null),
        tap((dat) => dat.token ? this.userService.token = dat.token : null)
      );
  }

  public emailTaken(email: string): Observable<boolean> {
    return this.apiService.get(`${this.baseUrl}/email-taken/${email}`)
      .pipe(
        pluck('email_taken')
      );
  }
}
