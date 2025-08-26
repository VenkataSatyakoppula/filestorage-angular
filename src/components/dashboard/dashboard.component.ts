import { Component, ElementRef, HostListener, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpeedDailComponent } from '../speed-dail/speed-dail.component';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { SvgIconComponent } from 'angular-svg-icon';
import { initFlowbite } from 'flowbite';
import { Observable } from 'rxjs';
import { FileItem, FileItems, UserState } from '../../models/file.model';
import { SharedService } from '../../services/shared.service';
import { fileTypes } from '../../content/filemap.content';
import { UploadProgress } from '../../models/progress.model';
import { User } from '../../models/user.model';
import { environment } from '../../environment/environment';
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,SpeedDailComponent,SideBarComponent,SvgIconComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  dropdown: boolean = false;
  gridView: boolean = true;
  
  selectedCount = signal(0);
  checkBoxChecked: {id: Number, flag: boolean}[] = [];
  public fileData$: Observable<FileItems>; 
  public recycleBin$: Observable<FileItems>;
  public userData$: Observable<UserState>; 
  showProgressBar$: Observable<UploadProgress | null>;
  public sideBarOption: string = 'myDrive';
  public headerOption$: Observable<string|null>;
  public downloadUrls$ : Observable<string|null>;
  constructor( private _sharedService: SharedService){
    this._sharedService.getUserFiles();
    this._sharedService.getRecycleBin();
    this.fileData$ = this._sharedService.filesData$;
    this.recycleBin$ = this._sharedService.recycleBin$;
    this.showProgressBar$ = this._sharedService.uploadProgress$;
    this.headerOption$ = this._sharedService.selectedOption$;
    this.userData$ = this._sharedService.userData$;
    this.downloadUrls$ = this._sharedService.downloadUrl$;
  }

  get currentData$() {
    this.headerOption$.subscribe({next:(option)=>{

      if(option && this.sideBarOption !== option){
        this.unselectAll();
        this.sideBarOption = option;
      }
    }});
    return this.sideBarOption === 'recycleBin' ? this.recycleBin$ : this.fileData$;
  }

  getRemPercentage(rem:string|undefined,total:string|undefined){
    return ( (1 - (Number(rem) / Number(total)))*100).toFixed(1).toString()
  }

  covertToSize(rem:string|undefined,total:string|undefined){
    const fileSize = Number(total) - Number(rem);
    return this.getShortForm(fileSize.toString())
  }

  getShortForm(size:string|undefined){
    const fileSize = Number(size);
    const KB = 1024;
    const MB = KB * 1024;
    const GB = MB * 1024;

    if (fileSize < KB) {
      return `${fileSize.toFixed(2)} B`;
    } else if (fileSize < MB) {
      return `${(fileSize / KB).toFixed(2)} KB`;
    } else if (fileSize < GB) {
      return `${(fileSize / MB).toFixed(2)} MB`;
    } else {
      return `${(fileSize / GB).toFixed(2)} GB`;
    }
  }

  getFileIcon(ext: string): string {
    const iconSize = (this.gridView)? "100.png":"50.png"
    if(ext in fileTypes){
      return fileTypes[ext]+iconSize;
    }
    return fileTypes["default"]+iconSize;
  }
  ngOnInit(){
    initFlowbite();
  }
  checkBox(index:string,id:Number){
    if(this.checkBoxChecked[Number.parseInt(index)].flag){
      this.selectedCount.update((val)=> {
        if(val > 0){
          return val - 1;
        }
        return 0;
      });
    }else{
      this.selectedCount.update((val)=> val+1);
    }
    this.checkBoxChecked[Number.parseInt(index)].id = id;
    this.checkBoxChecked[Number.parseInt(index)].flag = !this.checkBoxChecked[Number.parseInt(index)].flag;

  }

  downloadFiles(){
    const fileIds: Number[] = [] 
    for (let i = 0; i < this.checkBoxChecked.length; i++) {
      const element = this.checkBoxChecked[i];
      if(element.flag){
        fileIds.push(element.id);
      }
    }
    this._sharedService.downloadFiles(fileIds,this.sideBarOption);
    this.downloadUrls$.subscribe(url => {
      
      if (url) {
        const fileData = JSON.parse(url);
        const a = document.createElement('a');
        a.href = `${environment.apiBaseUrl}/file/${fileData.url}`;
        a.download = fileData.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        this._sharedService.clearDownloadUrl();
      }
    });
    this.unselectAll();
  }

  unselectAll(){
    for (let i = 0; i < this.checkBoxChecked.length; i++) {
      const element = this.checkBoxChecked[i];
      if(element){
        this.checkBoxChecked[i].flag = false;
      }
    }
    this.selectedCount.set(0);
  }

  deleteFiles(){
    const fileIds: Number[] = [] 
    for (let i = 0; i < this.checkBoxChecked.length; i++) {
      const element = this.checkBoxChecked[i];
      if(element.flag){
        fileIds.push(element.id);
      }
    }
    this._sharedService.deleteFiles(fileIds,this.sideBarOption);
    this.unselectAll();
  }
  restoreFiles(){
    const fileIds: Number[] = [] 
    for (let i = 0; i < this.checkBoxChecked.length; i++) {
      const element = this.checkBoxChecked[i];
      if(element.flag){
        fileIds.push(element.id);
      }
    }
    this._sharedService.restoreFiles(fileIds);
    this.unselectAll();
  }

  updateCheckBoxChecked(length: number) {
    if (this.checkBoxChecked.length !== length) {
      const arr = Array.from({ length }, () => ({ id: 0, flag: false }));
      this.checkBoxChecked = arr;
    }
  }
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const targetDiv = document.getElementById('dropdownDefaultButton');
    if (targetDiv && !targetDiv.contains(event.target as Node)) {
      this.dropdown = false;
    }
  }
}

