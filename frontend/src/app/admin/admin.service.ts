import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../global/services/api.service';
import { User } from '../models/user';

@Injectable()
export class AdminService {
  private baseUrl = '/api/admin';

  constructor(private api: ApiService) { }

  public getUnapprovedUsers(): Observable<User[]> {
    return this.api.get(`${this.baseUrl}/unapproved-users`);
  }

  public approveUser(id: string): Observable<{success: boolean, message?: string}> {
    return this.api.get(`${this.baseUrl}/approve-user/${id}`);
  }

  public deleteUser(id: string): Observable<{ success: boolean, message?: string }> {
    return this.api.get(`${this.baseUrl}/delete-user/${id}`);
  }
}
