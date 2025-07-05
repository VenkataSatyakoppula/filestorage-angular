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

  uploadFileAPI(formData:FormData){
    return this._http.post<FileItem>(`${environment.apiBaseUrl}/file/create`,formData,{
    reportProgress: true,
    observe: 'events'});
  }

}