import { Component, ElementRef, HostListener, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpeedDailComponent } from '../speed-dail/speed-dail.component';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { SvgIconComponent } from 'angular-svg-icon';
import { initFlowbite } from 'flowbite';
import { Observable } from 'rxjs';
import { FileItem } from '../../models/file.model';
import { SharedService } from '../../services/shared.service';
import { fileTypes } from '../../content/filemap.content';
import { UploadProgress } from '../../models/progress.model';
import { User } from '../../models/user.model';
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,SpeedDailComponent,SideBarComponent,SvgIconComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  dropdown: boolean = false;
  gridView: boolean = false;
  
  selectedCount = signal(0);
  checkBoxChecked: {id: Number, flag: boolean}[] = [];
  public fileData$: Observable<FileItem[] | []>; 
  public recycleBin$: Observable<FileItem[] | null>;
  public userData$: Observable<User | null>; 
  showProgressBar$: Observable<UploadProgress | null>;
  public sideBarOption: string = 'myDrive';
  public headerOption$: Observable<string|null>;
  constructor( private _sharedService: SharedService){
    this._sharedService.getUserFiles();
    this._sharedService.getRecycleBin();
    // const sideBar = sessionStorage.getItem("sideBar");
    // if (sideBar) {
    //   this.sideBarOption = sideBar;
    // }else{
    //   sessionStorage.setItem("sideBar",this.sideBarOption);
    // }
    this.fileData$ = this._sharedService.filesData$;
    this.recycleBin$ = this._sharedService.recycleBin$;
    this.showProgressBar$ = this._sharedService.uploadProgress$;
    this.headerOption$ = this._sharedService.selectedOption$;
    this.userData$ = this._sharedService.userData$;
  }

  get currentData$() {
    this.headerOption$.subscribe({next:(option)=>{
      if(option){
        this.sideBarOption = option;
      }
    }});
    return this.sideBarOption === 'recycleBin' ? this.recycleBin$ : this.fileData$;
  }

  getRemPercentage(rem:string,total:string){
    return ( (1 - (Number(rem) / Number(total)))*100).toFixed(2).toString()+"%"
  }

  covertToSize(rem:string,total:string){
    const fileSize = Number(total) - Number(rem);
    return this.getShortForm(fileSize.toString())
  }

  getShortForm(size:string){
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

  updateCheckBoxChecked(length: number) {
    if (this.checkBoxChecked.length !== length) {
      const arr = Array.from({ length }, () => ({ id: 0, flag: false }));
      this.checkBoxChecked = arr;
    }
  }
  changeOption(){
    if (this.sideBarOption == "recycleBin" || this.sideBarOption == "myDrive") {
      this.unselectAll();
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

