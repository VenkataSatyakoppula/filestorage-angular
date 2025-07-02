import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthenticateService } from '../services/authenticate.service';
import { LoginResponse } from '../models/login.response.model';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor( private _authService: AuthenticateService,private _router: Router){}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes("user/create") || req.url.includes("user/login") ) {
        return next.handle(req);
    }
    const authToken: LoginResponse = this._authService.getAuthToken();
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken.accessToken}`
      }
    });
    

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse)=>{
        if(error.statusText == "Unknown Error") {
          sessionStorage.removeItem('authToken');
          this._router.navigate(['/authenticate'],{ queryParams: { type: 'login' }});
        }
        return throwError(()=> error);
      })
    );
  }
}
