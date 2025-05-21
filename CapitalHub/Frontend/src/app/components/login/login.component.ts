import { Component, inject, AfterViewInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser }    from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router }               from '@angular/router';
import { MatInputModule }       from '@angular/material/input';
import { MatButtonModule }      from '@angular/material/button';
import { MatCheckboxModule }    from '@angular/material/checkbox';
import { MatCardModule }        from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule }         from '@angular/common';

import { AuthService }          from '../../services/auth.service';
import { environment }          from '../../../environments/environment';

declare global {
  interface Window { google?: any; }
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {
  private fb         = inject(FormBuilder);
  private auth       = inject(AuthService);
  private snack      = inject(MatSnackBar);
  private router     = inject(Router);
  private platformId = inject(PLATFORM_ID);

  loginForm: FormGroup = this.fb.group({
    email:      ['', [Validators.required, Validators.email]],
    password:   ['', [Validators.required]],
    rememberMe: [false]
  });

  ngAfterViewInit() {
    // Solo en el navegador; en SSR/prerender no tocar window
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.loadGoogleScript();
  }

  private loadGoogleScript() {
    // Comprobamos seguro que hay window
    if (typeof window === 'undefined') {
      return;
    }
    // Si ya está cargado, inicializamos
    if (window.google?.accounts?.id) {
      return this.initializeGoogleSignIn();
    }
    // Si no, lo inyectamos y esperamos onload
    const script = document.createElement('script');
    script.src   = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => this.initializeGoogleSignIn();
    document.head.appendChild(script);
  }

  private initializeGoogleSignIn() {
    window.google.accounts.id.initialize({
      client_id: environment.googleClient,
      callback:  (resp: any) => this.handleGoogleCredential(resp)
    });
    window.google.accounts.id.renderButton(
      document.getElementById('googleSignInButton')!,
      { theme: 'outline', size: 'large' }
    );
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    const { email, password, rememberMe } = this.loginForm.value;
    this.auth.login(email, password, rememberMe).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.snack.open('Credenciales inválidas', 'Cerrar', { duration: 3000 })
    });
  }

  private handleGoogleCredential(resp: any) {
    console.log('🔥 GSI callback got:', resp);
    this.auth.loginWithGoogle(resp.credential).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.snack.open('Google login falló', 'Cerrar', { duration: 3000 })
    });
  }

  forgotPassword(): void {
    const email = prompt('Introduce tu email registrado:');
    if (!email) return;
    this.auth.forgotPassword(email).subscribe({
      next: () => this.snack.open('Email de restablecimiento enviado', 'Cerrar', { duration: 3000 }),
      error: () => this.snack.open('Error enviando email', 'Cerrar', { duration: 3000 })
    });
  }
}
