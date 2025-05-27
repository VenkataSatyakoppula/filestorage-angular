import { Routes } from '@angular/router';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { LoginComponent } from '../components/login/login.component';
import { AuthGuard } from '../guards/auth.guard';

export const routes: Routes = [
    {path: '' ,pathMatch:'full', redirectTo: 'authenticate'},
    {path: 'authenticate',component:LoginComponent},
    {path: 'dashboard',component:DashboardComponent,canActivate:[AuthGuard]}
];
