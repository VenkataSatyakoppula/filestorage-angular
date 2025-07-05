import { Injectable, OnInit, signal } from '@angular/core';
import { CommonService } from './common.service';
import { BehaviorSubject, tap } from 'rxjs';
import { User } from '../models/user.model';
import { FileItem } from '../models/file.model';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { UploadProgress } from '../models/progress.model';
@Injectable({
  providedIn: 'root'
})
export class SharedService{
    userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User |  null>(null);
    fileSubject: BehaviorSubject<FileItem[] | []> = new BehaviorSubject<FileItem[] |  []>([]);
    SingleFileSubject: BehaviorSubject<FileItem|null> = new BehaviorSubject<FileItem|null>(null);
    uploadProgressSubject: BehaviorSubject<UploadProgress|null> = new BehaviorSubject<UploadProgress|null>(null);
    userData$ = this.userSubject.asObservable();
    filesData$ = this.fileSubject.asObservable();
    fileUploaded$ = this.SingleFileSubject.asObservable();
    uploadProgress$ = this.uploadProgressSubject.asObservable();
    uploadStatus = signal<string>(''); 
  constructor(private _commonAPI:CommonService) {
  }

  getUserData(){
    return this._commonAPI.getUserDataAPI().pipe(tap((data) => this.userSubject.next(data))).subscribe();
  }
  getUserFiles(){
    return this._commonAPI.getUserFilesAPI().pipe(tap(data=>this.fileSubject.next(data))).subscribe();
  }
  uploadFile(formData: FormData){
    return this._commonAPI.uploadFileAPI(formData).subscribe(
      {
        next: (event: HttpEvent<any>) =>{
          switch (event.type) {
            case HttpEventType.Sent:
              console.log('Upload request sent!');
              this.uploadStatus.set("start");
              break;
            case HttpEventType.UploadProgress:
              if (event.total) {
                const percent = Math.round((100 * event.loaded) / event.total);
                this.uploadProgressSubject.next({
                  name:formData.get("FileName")?.toString()!,
                  percent:percent.toString()
                });
                //console.log(`Upload progress: ${percent}%`);
              }
              break;
            case HttpEventType.Response:
              this.SingleFileSubject.next(event.body as FileItem);
              this.uploadProgressSubject.next(null);
              this.getUserFiles();
              this.uploadStatus.set("success");
              console.log('Upload complete:', event.body);
              break;
          }
        },
        error:(err)=>{
          console.log(err);
          this.uploadProgressSubject.next(null);
          this.uploadStatus.set("error");
        }
      }
    );
  }

}