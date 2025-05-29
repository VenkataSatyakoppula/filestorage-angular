import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthenticateService } from '../../services/authenticate.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginPayload } from '../../models/login.payload';
import { passwordMatchValidator } from '../../validators/password-match.validator';
import { SignUpPayload } from '../../models/signup.payload';
import { SignUpResponse } from '../../models/signup.response';
import { ToastService } from '../../services/toast.service';
@Component({
  selector: 'app-login',
  imports: [RouterLink,ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginMode: boolean = false;
  loginForm: FormGroup;
  signUpForm: FormGroup;
  loading: boolean = false;
  constructor(private route: ActivatedRoute,private _auth: AuthenticateService,private fb: FormBuilder,private _router: Router,private _toastService: ToastService){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.signUpForm = this.fb.group({
      Name:['',[Validators.required, (control: FormControl) => /^[A-Za-z\s]+$/.test(control.value) ? null : { onlyAlphabets: true }]],
      email:['',[Validators.required,Validators.email]],
      password: ['',[Validators.required]],
      password2: ['',[Validators.required]],
    },{validators: passwordMatchValidator('password','password2')});

  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.loginForm.reset();
      this.signUpForm.reset();
      this.loading = false;
      this.loginMode = this.route.snapshot.queryParamMap.get('type') === 'login'? true : false;
    });
    this._auth.logout();
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
        this._router.navigate(['dashboard']);
        this._toastService.show('Login Successful','success',3000);
      },
      error: (err) =>{
        this.loading = false;
        this._toastService.show('Invalid Login Credentials','error');
        console.log(err);
      }
    });
  }

  onRegister(){
    if(this.signUpForm.invalid){
      this.signUpForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    const payload: SignUpPayload ={
      name: this.signUpForm.get("Name")?.value,
      email: this.signUpForm.get("email")?.value,
      password: this.signUpForm.get("password")?.value
    } 
    this._auth.signUp(payload).subscribe({
      next: (res)=>{
        this.loading = false;
        console.log(res);
        if(res === "User Email Already Exists"){
          this.signUpForm.get('email')?.setErrors({ emailExists: true });
          return;
        }
        const result: SignUpResponse = JSON.parse(res);
        this._auth.setAuthToken(result.credentials);
        this._toastService.show('SignUp Successful','success',3000);
        this._router.navigate(['dashboard']);
      },
      error: (err) =>{
        this.loading = false;
        this._toastService.show('Something went wrong','error');
        console.log(err);
      }
    });



  }

}
