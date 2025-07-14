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
  showProgressBar$: Observable<UploadProgress | null>;
  public sideBarOption: string = 'myDrive';
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
  }

  get currentData$() {
    return this.sideBarOption === 'recycleBin' ? this.recycleBin$ : this.fileData$;
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
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const targetDiv = document.getElementById('dropdownDefaultButton');
    if (targetDiv && !targetDiv.contains(event.target as Node)) {
      this.dropdown = false;
    }
  }
}

