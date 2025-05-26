import { Injectable } from '@angular/core';
import { LoginResponse } from '../models/login.response.model';
import { LoginPayload } from '../models/login.payload';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  constructor( private _http:HttpClient) {}

  private _authToken: LoginResponse = {
    userId: 0,
    accessToken: '',
    expiresIn:0
  };

  getAuthToken(): LoginResponse{
    const authTokenString = sessionStorage.getItem('authToken');
    this._authToken = authTokenString ? JSON.parse(authTokenString) : { userId: 0, accessToken: '', expiresIn: 0 };
    return this._authToken;
  }
  setAuthToken(token: LoginResponse){
    sessionStorage.setItem('authToken',JSON.stringify(token));
    this._authToken = token;
  }

  isLoggedIn(){
    return !!sessionStorage.getItem('authToken');
  }

  logout(){
    sessionStorage.removeItem('authToken');
  }

  login(payload:LoginPayload){
    return this._http.post<LoginResponse>(`${environment.apiBaseUrl}/user/login`,payload);
  }

  healthCheck(){
    return this._http.get(`${environment.apiBaseUrl}/health`);
  }
  

}