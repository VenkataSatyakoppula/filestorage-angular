import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-side-bar',
  imports: [SvgIconComponent,CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
  selectedFile : File | null = null;
  public userData$: Observable<User | null>; 
  @Input() menu: string = 'myDrive';

  constructor(private _sharedService: SharedService){
    this.userData$ = this._sharedService.userData$;
  }


  onFileSelected(event: Event){
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
    this.UploadFile();
  }

  UploadFile(){
    if (!this.selectedFile) {
        console.warn('No file selected.');
        return;
    }
    const formData = new FormData();

    formData.append("formFile",this.selectedFile);
    formData.append("FileName",this.selectedFile.name.split(".")[0]);
    this._sharedService.uploadFile(formData);
    this._sharedService.getUserFiles();

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

  selectOption(option:string){
    this.menu = option;
    this._sharedService.setOption(option);
  }

}
