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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ForgotPasswordDialogComponent } from '../forgot-password-dialog/forgot-password-dialog.component';

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
    MatDialogModule,
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
  private dialog = inject(MatDialog);
  serverError: string | null = null;

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
    this.serverError = null;
    const { email, password, rememberMe } = this.loginForm.value;

    this.auth.login(email, password, rememberMe).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        const msg = err.error?.error || 'Credenciales inválidas';
        const lower = msg.toLowerCase();

        // Si el mensaje menciona "correo" o "email" lo asignamos a email…
        if (lower.includes('correo') || lower.includes('email')) {
          this.loginForm.get('email')?.setErrors({ serverError: msg });
        }
        // Si menciona "contraseña" o es genérico lo mandamos a password
        else {
          this.loginForm.get('password')?.setErrors({ serverError: msg });
        }
      }
    });
  }

  private handleGoogleCredential(resp: any) {
    this.auth.loginWithGoogle(resp.credential).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        const msg = err.error.error
        const emailCtrl = this.loginForm.get('email');
        emailCtrl?.setErrors({ serverError: msg });
      }
    });
  }

  forgotPassword(): void {
    this.dialog.open(ForgotPasswordDialogComponent, {
      width: '360px'
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

}
