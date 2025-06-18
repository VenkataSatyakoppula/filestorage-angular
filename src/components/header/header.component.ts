import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { RouterLink } from '@angular/router';
import { AuthenticateService } from '../../services/authenticate.service';
import { SharedService } from '../../services/shared.service';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
@Component({
  selector: 'app-header',
  imports: [CommonModule, SvgIconComponent, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent{
  menuOpen = false;
  public userdata$!: Observable<User>;
  constructor(private _auth:AuthenticateService,private _sharedData:SharedService){
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

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  
}
