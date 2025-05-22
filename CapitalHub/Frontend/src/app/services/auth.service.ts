import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser }              from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap }        from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private isBrowser: boolean;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  /** Login tradicional: 30d o 12h según rememberMe */
  login(email: string, contraseña: string, rememberMe: boolean) {
    const endpoint = rememberMe ? 'login' : 'login-short';
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/usuarios/${endpoint}`, { email, contraseña })
      .pipe(
        tap(res => {
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
        tap(res => localStorage.setItem('token', res.token))
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

 isLoggedIn(): boolean {
    if (!this.isBrowser) return false;
    // Chequea **ambos** lugares
    return !!(
      localStorage.getItem('token') ||
      sessionStorage.getItem('token')
    );
  }

}
