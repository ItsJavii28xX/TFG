// src/app/app.routes.ts
import { Routes } from '@angular/router';

import { LoginComponent }          from './components/login/login.component';
import { ResetPasswordComponent }  from './components/reset-password/reset-password.component';
import { RegisterComponent } from './components/register/register.component';
import { LayoutComponent }        from './components/layout/layout.component';
import { AuthGuard }              from './guards/auth.guard';
import { ContentComponent } from './components/content/content.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { PersonalComponent } from './components/personal/personal.component';

export const routes: Routes = [

  { path: 'login',          component: LoginComponent },
  { path: 'register',       component: RegisterComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'personal',   component: PersonalComponent },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '',           redirectTo: 'home', pathMatch: 'full' },
      { path: 'home',       component: ContentComponent },
      { path: 'perfil/:id', component: UserProfileComponent },
    ]
  },

  { path: '**', redirectTo: '' }
];
