import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';
import { User } from '../models/user.model';
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(private _http: HttpClient) {}

  getUserDataAPI(){
    return this._http.get<User>(`${environment.apiBaseUrl}/user/get`);
  }

}