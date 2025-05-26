import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticateService } from '../services/auhenticate.service';
import { LoginResponse } from '../models/login.response.model';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor( private _authService: AuthenticateService){}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes("user/create") || req.url.includes("user/login") ) {
        return next.handle(req);
    }
    const authToken: LoginResponse = this._authService.getAuthToken();
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });

    return next.handle(authReq);
  }
}
