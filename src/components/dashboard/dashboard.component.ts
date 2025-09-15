import { Component, ElementRef, HostListener, OnInit, signal, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpeedDailComponent } from '../speed-dail/speed-dail.component';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { SvgIconComponent } from 'angular-svg-icon';
import { initFlowbite } from 'flowbite';
import { filter, Observable, switchMap,from, take } from 'rxjs';
import { FileItem, FileItems, UserState } from '../../models/file.model';
import { SharedService } from '../../services/shared.service';
import { fileTypes } from '../../content/filemap.content';
import { UploadProgress } from '../../models/progress.model';
import JSZip, { file } from 'jszip';
import { saveAs } from 'file-saver';
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
    this.downloadUrls$.pipe(filter((url):url is string => !!url),switchMap(url =>this.handleDownload(url)),take(1)).subscribe();
    this.unselectAll();
  }
  async ZipFiles(fileLinks: { url: string; fileName: string }[]) {
  const zip = new JSZip();
  let cnt = 0;
  for (const file of fileLinks) {
    const response = await fetch(file.url);
    if (!response.ok) throw new Error(`Failed to fetch ${file.fileName}`);

    const blob = await response.blob();
    cnt+= 1
    this._sharedService.uploadProgressSubject.next({
      percent: `${cnt} / ${fileLinks.length}`,
      type:"zipping"
    });
    zip.file(file.fileName, blob);
  }

  const content = await zip.generateAsync({ type: 'blob' });
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-'); 
  saveAs(content, `files-${timestamp}.zip`);
  }

  async handleDownload(url: string){
    if (!url) return;
    const fileData = JSON.parse(url);
    if (fileData.length > 1){
      this.ZipFiles(fileData).then(()=>{
        this._sharedService.clearUploadProgress();
        this._sharedService.clearDownloadUrl();
      });
      return
    }
    const a = document.createElement('a');
    a.href = fileData[0].url;
    a.download = fileData[0].fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    this._sharedService.clearDownloadUrl();
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

