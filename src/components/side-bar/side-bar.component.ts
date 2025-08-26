import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { ToastService } from '../../services/toast.service';
import { RenameModalComponent } from '../rename-modal/rename-modal.component';
import { ModalService } from '../../services/modal.service';
import { UserState } from '../../models/file.model';

@Component({
  selector: 'app-side-bar',
  imports: [SvgIconComponent,CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
  selectedFile : File | null = null;
  public userData$: Observable<UserState>; 
  @Input() menu: string = 'myDrive';

  constructor(private _sharedService: SharedService, private _toastService: ToastService, private _modalService: ModalService){
    this.userData$ = this._sharedService.userData$;
  }


  onFileSelected(event: Event){
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
    this.UploadFile(input);
  }

  UploadFile(input: HTMLInputElement){
    if (!this.selectedFile) {
        console.warn('No file selected.');
        return;
    }
    const fileName = this.selectedFile.name;
    this._modalService.show(fileName);
    this._modalService.setFile(this.selectedFile);
    input.value = '';
    return;


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

  selectOption(option:string){
    this.menu = option;
    this._sharedService.setOption(option);
  }

}
