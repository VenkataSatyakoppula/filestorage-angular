import { Inject, Injectable, OnInit, PLATFORM_ID } from '@angular/core';
import { LoginResponse } from '../models/login.response.model';
import { LoginPayload } from '../models/login.payload';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environment/environment';
import { isPlatformBrowser } from '@angular/common';
import { SignUpPayload } from '../models/signup.payload';
import { SignUpResponse } from '../models/signup.response';
@Injectable({
  providedIn: 'root'
})
export class AuthenticateService implements OnInit{
  
  constructor( private _http:HttpClient,@Inject(PLATFORM_ID) private platformId: any) {}

  ngOnInit(): void {

  }
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
    if('authToken' in sessionStorage){
      
      // const headers = new HttpHeaders({
      //   'Authorization': `Bearer ${this._authToken.accessToken}`,
      // });
      this._http.get(`${environment.apiBaseUrl}/user/logout`).subscribe({
        next:()=>{
          sessionStorage.removeItem('authToken');
        },
        error:(err)=>{
          console.log(err);
        }
      }
      )
    }
  }

  login(payload:LoginPayload){
    return this._http.post<LoginResponse>(`${environment.apiBaseUrl}/user/login`,payload);
  }

  signUp(payload:SignUpPayload){
    return this._http.post<string|any>(`${environment.apiBaseUrl}/user/create`,payload,{
      responseType: 'text' as 'json',
    });
  }

  healthCheck(){
    return this._http.get(`${environment.apiBaseUrl}/health`);
  }
  

}