import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthenticateService } from '../../services/auhenticate.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginPayload } from '../../models/login.payload';
@Component({
  selector: 'app-login',
  imports: [RouterLink,ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginMode: boolean = false;
  loginForm: FormGroup;
  loading: boolean = false;
  constructor(private route: ActivatedRoute,private _auth: AuthenticateService,private fb: FormBuilder,private _router: Router){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.loginForm.reset();
      this.loginMode = this.route.snapshot.queryParamMap.get('type') === 'login'? true : false;
    });
  }
  onLogin(){
    if(this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    const payload: LoginPayload = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value
    }
    this._auth.login(payload).subscribe({
      next: (res)=>{
        this._auth.setAuthToken(res);
        this.loading = false;
        this._router.navigate(['dashboard'])
      },
      error: (err) =>{
        this.loading = false;
        console.log(err);
      }
    });
  }

}
