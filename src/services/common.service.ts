import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';
import { User } from '../models/user.model';
import { FileItem } from '../models/file.model';
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(private _http: HttpClient) {}

  getUserDataAPI(){
    return this._http.get<User>(`${environment.apiBaseUrl}/user/get`);
  }

  getUserFilesAPI(){
    return this._http.get<FileItem[]>(`${environment.apiBaseUrl}/file/get`);
  }

  deleteUserFilesAPI(fileId : Number){
    return this._http.delete<{message:string}>(`${environment.apiBaseUrl}/file/delete/${fileId}`);
  }
  wipeUserFilesAPI(fileId : Number){
    return this._http.delete<{message:string}>(`${environment.apiBaseUrl}/file/wipe/${fileId}`);
  }
  restoreUserFilesAPI(fileId: Number){
    return this._http.post<{message:string}>(`${environment.apiBaseUrl}/file/restore/${fileId}`,{});
  }

  generateFileLinkAPI(fileForm: FormData){
    return this._http.post<{url:string}>(`${environment.apiBaseUrl}/file/generate-link`,fileForm);
  }

  getRecycleBinFilesAPI(){
    return this._http.get<FileItem[]>(`${environment.apiBaseUrl}/file/recycle`);
  }

  uploadFileAPI(formData:FormData){
    return this._http.post<FileItem>(`${environment.apiBaseUrl}/file/create`,formData,{
    reportProgress: true,
    observe: 'events'});
  }

}