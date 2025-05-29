import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser }              from '@angular/common';
import { HttpClient }                      from '@angular/common/http';
import { environment }                     from '../../environments/environment';
import { tap }                             from 'rxjs/operators';
import { GroupService }                    from './group.service';

export interface User {
  id_usuario: number;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  imagen_perfil: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl: string = environment.apiUrl;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private groupSvc: GroupService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  getUserId(): number | null {
    const token =
      localStorage.getItem('token') ||
      sessionStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id_usuario ?? null;
    } catch {
      return null;
    }
  }

  /** Login tradicional: 30d o 12h según rememberMe */
  login(email: string, contraseña: string, rememberMe: boolean) {
    const endpoint = rememberMe ? 'login' : 'login-short';
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/usuarios/${endpoint}`, { email, contraseña })
      .pipe(
        tap(res => {
          // 1) almacenar token
          const storage = rememberMe ? localStorage : sessionStorage;
          storage.setItem('token', res.token);

        })
      );
  }

  /** Login con Google SSO */
  loginWithGoogle(credential: string) {
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/usuarios/login-google`, { credential })
      .pipe(
        tap(res => {
          // 1) siempre en localStorage
          localStorage.setItem('token', res.token);

        })
      );
  }

  /** Enviar email de restablecimiento */
  forgotPassword(email: string) {
    return this.http.post<{ mensaje: string }>(
      `${this.apiUrl}/usuarios/forgot-password`,
      { email }
    );
  }

  /** Resetear contraseña con token */
  resetPassword(token: string, newPassword: string) {
    return this.http.post<{ mensaje: string }>(
      `${this.apiUrl}/usuarios/reset-password`,
      { token, newPassword }
    );
  }

  /** ¿Está logueado? */
  isLoggedIn(): boolean {
    if (!this.isBrowser) return false;
    return !!(
      localStorage.getItem('token') ||
      sessionStorage.getItem('token')
    );
  }

  getUserById(id: number) {
    return this.http.get<User>(
      `${this.apiUrl}/usuarios/${id}`
    );
  }

}
