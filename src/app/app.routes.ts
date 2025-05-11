import { Routes } from '@angular/router';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { LoginComponent } from '../components/login/login.component';

export const routes: Routes = [
    {path: '' ,pathMatch:'full', redirectTo: 'login'},
    {path: 'login',component:LoginComponent},
    {path: 'dashboard',component:DashboardComponent}
];
