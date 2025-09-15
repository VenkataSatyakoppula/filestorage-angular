import { Injectable, OnInit, signal } from '@angular/core';
import { CommonService } from './common.service';
import { BehaviorSubject, forkJoin, Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { FileItem, FileItems, UserState } from '../models/file.model';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { UploadProgress } from '../models/progress.model';
import { ToastService } from './toast.service';
import { Router } from '@angular/router';
import { fileItemsInit, userInit } from '../content/initial.state.content';
@Injectable({
  providedIn: 'root'
})

export class SharedService{
    userSubject: BehaviorSubject<UserState> = new BehaviorSubject<UserState>(userInit);
    fileSubject: BehaviorSubject<FileItems> = new BehaviorSubject<FileItems>(fileItemsInit);
    SingleFileSubject: BehaviorSubject<FileItem|null> = new BehaviorSubject<FileItem|null>(null);
    uploadProgressSubject: BehaviorSubject<UploadProgress|null> = new BehaviorSubject<UploadProgress|null>(null);
    recycleBinSubject: BehaviorSubject<FileItems> = new BehaviorSubject<FileItems>(fileItemsInit);
    selectedOptionSubject: BehaviorSubject<string | null> = new BehaviorSubject<string|null>(null);
    downloadUrlSubject: BehaviorSubject<string | null> = new BehaviorSubject<string|null>(null);
    userData$ = this.userSubject.asObservable();
    filesData$ = this.fileSubject.asObservable();
    fileUploaded$ = this.SingleFileSubject.asObservable();
    uploadProgress$ = this.uploadProgressSubject.asObservable();
    recycleBin$ = this.recycleBinSubject.asObservable();
    selectedOption$ = this.selectedOptionSubject.asObservable();
    downloadUrl$ = this.downloadUrlSubject.asObservable();
    uploadStatus: string = ''; 
  constructor(private _commonAPI:CommonService,private _toastService: ToastService,private _router: Router) {
  }

  getUserData(){
    this.userSubject.next({
      user: {},
      isLoading: true
    })
    return this._commonAPI.getUserDataAPI().pipe(tap((data) => this.userSubject.next({
      user: data,
      isLoading: false
    }))).subscribe();
  }
  getUserFiles(){
    this.fileSubject.next({
      files: [],
      isLoading: true
    });
    return this._commonAPI.getUserFilesAPI().pipe(tap(data=>this.fileSubject.next({
      files: data,
      isLoading: false
    }))).subscribe();
  }
  getRecycleBin(){
    this.recycleBinSubject.next({
      files: [],
      isLoading: true
    });
    return this._commonAPI.getRecycleBinFilesAPI().pipe(tap(data=>this.recycleBinSubject.next({
      files: data,
      isLoading: false,
    }))).subscribe();
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
                  percent:percent.toString(),
                  type:"upload"
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
          if (err.error.includes("Storage Limit exceeded")) {
            this._toastService.show("Storage Limit exceeded!","error",10000);
            return;
          }
          this.uploadProgressSubject.next(null);
          this.uploadStatus = "error";
          this._toastService.show("Something went wrong!","error",10000)
        }
      }
    );
  }
  downloadFiles(fileIds: Number[],fileIn : string){
    var fileFormData = new FormData();

    for (let i = 0; i < fileIds.length; i++) {
      const element = fileIds[i];
      if (fileIn === "myDrive") {
        fileFormData.append("fileIds",element.toString());
      }
      else if(fileIn === "recycleBin"){
        // del_refs.push(this._commonAPI.wipeUserFilesAPI(element));
      }
    }
    if (fileIds.length > 1) {
      this.uploadProgressSubject.next({
        name:"",
        percent:`0 / ${fileIds.length}`,
        type:"zipping"
      });
    }

    return this._commonAPI.generateFileLinkAPI(fileFormData).subscribe({
      next:(res)=>{
        if (res) {
            this.downloadUrlSubject.next(JSON.stringify(res));  
        }
      },
      error:()=>{
        this._toastService.show("File Download Failed,Please try again!","error",10000)
      }
    });
  }
  clearDownloadUrl(){
    this.downloadUrlSubject.next(null);
  }
  clearUploadProgress(){
    this.uploadProgressSubject.next(null);
  }

  checkFileExists(fileName: string){
    const curFiles = this.fileSubject.getValue();
    for (let i = 0; i < curFiles.files.length; i++) {
      const element = curFiles.files[i];
      if (element.fileName === fileName || this.splitFilename(element.fileName).name === fileName){
        return true;
      }
    }
    return false;
  }
  splitFilename(filename:string) {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot === -1 || lastDot === 0) {
    return { name: filename, extension: "" };
  }

  return {
    name: filename.substring(0, lastDot),
    extension: filename.substring(lastDot + 1)
  };
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
        if (deleteType === "myDrive") {
          this._toastService.show("Moved to Recycle bin!","success",10000);
        }
        else{
          this._toastService.show("Moved to Hell!","success",10000);
        }
        
      },
      error:()=>{
        this._toastService.show("Error Deleting File/Files","error",10000)
      }
    });
  }

  restoreFiles(fileIds: Number[]){
    const del_refs: Observable<{message:string}>[] = []; 

    for (let i = 0; i < fileIds.length; i++) {
      const element = fileIds[i];
        del_refs.push(this._commonAPI.restoreUserFilesAPI(element));
    }
      this.uploadProgressSubject.next({
        name:"",
        percent:"",
        type:"restoring"
      });
    return forkJoin(del_refs).subscribe({
      next:()=>{
        this.uploadProgressSubject.next(null);
        this.getUserFiles();
        this.getRecycleBin();
        this.getUserData();
      },
      error:()=>{
        this._toastService.show("Error restoring File/Files","error",10000)
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