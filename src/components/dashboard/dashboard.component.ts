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
import { ToastService } from '../../services/toast.service';
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
  checkBoxChecked: boolean[] = [];
  public fileData$: Observable<FileItem[] | []>; 
  showProgressBar$: Observable<UploadProgress | null>;
  uploadStatus = signal<string>('');

  constructor( private _sharedService: SharedService, private _toastService: ToastService){
    this._sharedService.getUserFiles();
    this.fileData$ = this._sharedService.filesData$;
    this.showProgressBar$ = this._sharedService.uploadProgress$;
    this.uploadStatus = this._sharedService.uploadStatus;
    console.log(this.uploadStatus());
    if (this.uploadStatus() === "error") {
      this._toastService.show("Error Uploading File","error",10000)
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
  checkBox(index:string){
    if(this.checkBoxChecked[Number.parseInt(index)]){
      this.selectedCount.update((val)=> {
        if(val > 0){
          return val - 1;
        }
        return 0;
      });
    }else{
      this.selectedCount.update((val)=> val+1);
    }
    this.checkBoxChecked[Number.parseInt(index)] = !this.checkBoxChecked[Number.parseInt(index)];
  }

  unselectAll(){
    for (let i = 0; i < this.checkBoxChecked.length; i++) {
      const element = this.checkBoxChecked[i];
      if(element){
        this.checkBoxChecked[i] = false;
      }
    }
    this.selectedCount.set(0);
  }

  updateCheckBoxChecked(length: number) {
    if (this.checkBoxChecked.length !== length) {
      this.checkBoxChecked = new Array(length).fill(false);
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

