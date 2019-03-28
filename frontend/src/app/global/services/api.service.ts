import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private postHeaders: HttpHeaders;

  constructor(private http: HttpClient) {
    this.postHeaders = new HttpHeaders();
    this.postHeaders.append('Content-Type', 'application/json');
    this.postHeaders.append('Accept', 'application/json');
  }

  public get<T = any>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }

  public post<T = any>(url: string, data: any): Observable<T> {
    return this.http.post<T>(url, data, { headers: this.postHeaders });
  }
}
