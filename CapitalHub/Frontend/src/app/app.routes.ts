// src/app/app.routes.ts
import { Routes } from '@angular/router';

import { LoginComponent }          from './components/login/login.component';
import { ResetPasswordComponent }  from './components/reset-password/reset-password.component';
import { RegisterComponent } from './components/register/register.component';
import { LayoutComponent }        from './components/layout/layout.component';
import { AuthGuard }              from './guards/auth.guard';

export const routes: Routes = [

  { path: 'login',          component: LoginComponent },
  { path: 'register',       component: RegisterComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

    ]
  },

  { path: '**', redirectTo: '' }
];
