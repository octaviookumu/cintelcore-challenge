import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = `${environment.apiBaseUrl}/users`;

  constructor(private readonly _http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this._http.get<User[]>(this.apiUrl);
  }
}
