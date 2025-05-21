import { Routes } from '@angular/router';
import { LoginComponent }          from './components/login/login.component';
import { ResetPasswordComponent }  from './components/reset-password/reset-password.component';

export const routes: Routes = [
  { path: 'login',          component: LoginComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: '',                redirectTo: 'login', pathMatch: 'full' },
  { path: '**',              redirectTo: 'login' }
];
