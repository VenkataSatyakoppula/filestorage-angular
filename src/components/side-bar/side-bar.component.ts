import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-bar',
  imports: [SvgIconComponent,CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
  selectedFile : File | null = null;
  @Input() menu: string = 'myDrive';
  @Output() menuChange:EventEmitter<string> = new EventEmitter<string>(); 

  constructor(private _sharedService: SharedService){}


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

  selectOption(option:string){
    this.menu = option;
    this.menuChange.emit(option);
  }

}
