import { Routes } from '@angular/router';
import { LoginComponent }          from './components/login/login.component';
import { ResetPasswordComponent }  from './components/reset-password/reset-password.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
  { path: 'login',          component: LoginComponent },
  { path: 'register',        component: RegisterComponent },
  { path: 'reset-password',  component: ResetPasswordComponent },
  { path: '',                redirectTo: 'login', pathMatch: 'full' },
  { path: '**',              redirectTo: 'login' }
];
