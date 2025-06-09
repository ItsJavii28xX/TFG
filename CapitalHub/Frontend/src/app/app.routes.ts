// src/app/app.routes.ts
import { Routes } from '@angular/router';

import { LoginComponent }          from './components/login/login.component';
import { ResetPasswordComponent }  from './components/reset-password/reset-password.component';
import { RegisterComponent } from './components/register/register.component';
import { LayoutComponent }        from './components/layout/layout.component';
import { AuthGuard }              from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { PersonalComponent } from './components/personal/personal.component';
import { GroupDetailsComponent } from './components/group-details/group-details.component';

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
      { path: '',               redirectTo: 'home',            pathMatch: 'full' },
      { path: 'home',           component: HomeComponent, data: { animation: 'HomePage' }       },
      { path: 'perfil/:id',     component: UserProfileComponent },
      { path: 'app-group-details/:id_grupo', component: GroupDetailsComponent, data: { animation: 'DetailsPage' } }
    ]
  },
  { path: '**', redirectTo: '' }
];
