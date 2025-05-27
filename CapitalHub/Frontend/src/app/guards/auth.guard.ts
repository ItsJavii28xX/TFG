import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    // isLoggedIn comprueba localStorage o sessionStorage
    if (this.auth.isLoggedIn()) {
      return true;
    }
    // Si no, devolvemos un UrlTree → redirige al login
    return this.router.createUrlTree(['/login']);
  }
}
