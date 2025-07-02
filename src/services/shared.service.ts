import { Injectable, OnInit } from '@angular/core';
import { CommonService } from './common.service';
import { BehaviorSubject, tap } from 'rxjs';
import { User } from '../models/user.model';
import { FileItem } from '../models/file.model';
@Injectable({
  providedIn: 'root'
})
export class SharedService{
    userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User |  null>(null);
    fileSubject: BehaviorSubject<FileItem[] | []> = new BehaviorSubject<FileItem[] |  []>([]);
    SingleFileSubject: BehaviorSubject<FileItem|null> = new BehaviorSubject<FileItem|null>(null);
    userData$ = this.userSubject.asObservable();
    filesData$ = this.fileSubject.asObservable();
    fileUploaded$ = this.SingleFileSubject.asObservable();
  constructor(private _commonAPI:CommonService) {
  }

  getUserData(){
    return this._commonAPI.getUserDataAPI().pipe(tap((data) => this.userSubject.next(data))).subscribe();
  }
  getUserFiles(){
    return this._commonAPI.getUserFilesAPI().pipe(tap(data=>this.fileSubject.next(data))).subscribe();
  }

  uploadFile(formData: FormData){
    return this._commonAPI.uploadFileAPI(formData).pipe(tap(data=>this.SingleFileSubject.next(data))).subscribe();
  }

}