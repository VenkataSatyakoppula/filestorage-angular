import { Injectable, OnInit, signal } from '@angular/core';
import { CommonService } from './common.service';
import { BehaviorSubject, forkJoin, Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { FileItem } from '../models/file.model';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { UploadProgress } from '../models/progress.model';
import { ToastService } from './toast.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class SharedService{
    userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User |  null>(null);
    fileSubject: BehaviorSubject<FileItem[] | []> = new BehaviorSubject<FileItem[] |  []>([]);
    SingleFileSubject: BehaviorSubject<FileItem|null> = new BehaviorSubject<FileItem|null>(null);
    uploadProgressSubject: BehaviorSubject<UploadProgress|null> = new BehaviorSubject<UploadProgress|null>(null);
    recycleBinSubject: BehaviorSubject<FileItem[]|null> = new BehaviorSubject<FileItem[]|null>(null);
    selectedOptionSubject: BehaviorSubject<string | null> = new BehaviorSubject<string|null>(null);
    userData$ = this.userSubject.asObservable();
    filesData$ = this.fileSubject.asObservable();
    fileUploaded$ = this.SingleFileSubject.asObservable();
    uploadProgress$ = this.uploadProgressSubject.asObservable();
    recycleBin$ = this.recycleBinSubject.asObservable();
    selectedOption$ = this.selectedOptionSubject.asObservable();
    uploadStatus: string = ''; 
  constructor(private _commonAPI:CommonService,private _toastService: ToastService,private _router: Router) {
  }

  getUserData(){
    return this._commonAPI.getUserDataAPI().pipe(tap((data) => this.userSubject.next(data))).subscribe();
  }
  getUserFiles(){
    return this._commonAPI.getUserFilesAPI().pipe(tap(data=>this.fileSubject.next(data))).subscribe();
  }
  getRecycleBin(){
    return this._commonAPI.getRecycleBinFilesAPI().pipe(tap(data=>this.recycleBinSubject.next(data))).subscribe();
  }
  uploadFile(formData: FormData){
    return this._commonAPI.uploadFileAPI(formData).subscribe(
      {
        next: (event: HttpEvent<any>) =>{
          switch (event.type) {
            case HttpEventType.Sent:
              console.log('Upload request sent!');
              this.uploadStatus ="start";
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
              this.getUserData();
              this.uploadStatus = "success";
              this._toastService.show("Successfully uploaded!","success",10000);
              this._router.navigate(["/dashboard"]);
              break;
          }
        },
        error:(err)=>{
          console.log(err);
          this.uploadProgressSubject.next(null);
          this.uploadStatus = "error";
          this._toastService.show("Error Uploading File","error",10000)
        }
      }
    );
  }

  deleteFiles(fileIds: Number[],deleteType:string){
    const del_refs: Observable<{message:string}>[] = []; 

    for (let i = 0; i < fileIds.length; i++) {
      const element = fileIds[i];
      if (deleteType === "myDrive") {
        del_refs.push(this._commonAPI.deleteUserFilesAPI(element));
      }
      else if(deleteType === "recycleBin"){
        del_refs.push(this._commonAPI.wipeUserFilesAPI(element));
      }
    }

    return forkJoin(del_refs).subscribe({
      next:()=>{
        this.getUserFiles();
        this.getRecycleBin();
        this.getUserData();
      },
      error:()=>{
        this._toastService.show("Error Deleting File/Files","error",10000)
      }
    });
  }

  setOption(option:string){
    this.selectedOptionSubject.next(option);
  }


  clearUploadStatus(){
    this.uploadStatus = '';
  }
}