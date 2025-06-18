import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { CommonService } from './common.service';
import { BehaviorSubject, tap } from 'rxjs';
import { User } from '../models/user.model';
import { AuthenticateService } from './authenticate.service';
@Injectable({
  providedIn: 'root'
})
export class SharedService {
    userSubject: BehaviorSubject<User> = new BehaviorSubject<User>({
    id:0,
    email:"",
    name:"",
    });
    userData$ = this.userSubject.asObservable();
  constructor(private _commonAPI:CommonService) {
  }

  getUserData(){
    return this._commonAPI.getUserDataAPI().pipe(tap((data) => this.userSubject.next(data))).subscribe();
  }

}