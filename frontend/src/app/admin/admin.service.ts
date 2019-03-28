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
}
