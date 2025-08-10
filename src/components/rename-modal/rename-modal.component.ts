import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../services/modal.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-rename-modal',
  imports: [CommonModule,FormsModule],
  templateUrl: './rename-modal.component.html',
  styleUrl: './rename-modal.component.css'
})
export class RenameModalComponent implements OnInit {
  showModal = false;
  fileName = 'my-file.txt';
  newFileName = '';
  error = false;
  errorMsg = '';

  constructor(private _modalService: ModalService,private _sharedService: SharedService){
  }

  ngOnInit(){
    
    this._modalService.modal$.subscribe((option:{message:string,show:boolean}) => {
      this.showModal = option.show; 
      this.fileName = option.message;
      this.newFileName = option.message;
    });
  }

  closeModal() {
    this.showModal = false;
    this.newFileName = '';
    this.error = false;
    this._modalService.hide('');
  }

  renameFile() {
    if (this.newFileName.trim() === null || this.newFileName.trim() === '' || this.isValidFileName(this.newFileName.trim())) {
      this.error = true;
      this.errorMsg = "Name is invalid!";
      return
    }
    if(this._sharedService.checkFileExists(this.newFileName.trim())){
      this.errorMsg = "File Already Exists!" 
      this.error = true;
      return;
    }
    const fileName = this.newFileName.trim();
    this.closeModal();
    const formData = new FormData();

    if (this._modalService.curFile) {
      formData.append("formFile", this._modalService.curFile);
    }
    formData.append("FileName",this.splitFilename(fileName).name);
    this._sharedService.uploadFile(formData);
    this._sharedService.getUserFiles();
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

  isValidFileName(fileName:string) {
    const pattern = /^(?!.*([<>:"/\\|?*]|[.]{2,}|\/|\.\.))([a-zA-Z0-9_-]+(?:[ .a-zA-Z0-9_-]*[a-zA-Z0-9_-])?)(?:\.[a-zA-Z0-9]+)?$/;
    return !pattern.test(fileName);
  }
}
