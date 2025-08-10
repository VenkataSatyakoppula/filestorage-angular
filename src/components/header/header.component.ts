import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { RouterLink } from '@angular/router';
import { AuthenticateService } from '../../services/authenticate.service';
import { SharedService } from '../../services/shared.service';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { ModalService } from '../../services/modal.service';
@Component({
  selector: 'app-header',
  imports: [CommonModule, SvgIconComponent, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent{
  menuOpen = false;
  selectedFile : File | null = null;
  public userdata$!: Observable<User| null>;
  constructor(private _auth:AuthenticateService,private _sharedData:SharedService,private _modalService: ModalService){
    this.userdata$ = this._sharedData.userData$;
  }

  isLoggedIn(){
    return this._auth.isLoggedIn();
  }
  logOut(){
    if (this.menuOpen){
      this.menuOpen = false;
    }
    this._auth.logout();
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
    const fileName = this.selectedFile.name.split(".")[0];
    this._modalService.show(fileName);
    this._modalService.setFile(this.selectedFile);
    input.value = '';
    return;
  }

  selectOption(option:string){
    this._sharedData.setOption(option);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  
}
