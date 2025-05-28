import { Component, inject, NgZone, AfterViewInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser }    from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, MinLengthValidator, MaxLengthValidator } from '@angular/forms';
import { Router }               from '@angular/router';
import { MatInputModule }       from '@angular/material/input';
import { MatButtonModule }      from '@angular/material/button';
import { MatCheckboxModule }    from '@angular/material/checkbox';
import { MatCardModule }        from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule }     from '@angular/material/dialog';
import { MatProgressSpinnerModule }       from '@angular/material/progress-spinner';
import { CommonModule }         from '@angular/common';
import { finalize }             from 'rxjs';

import { AuthService }          from '../../services/auth.service';
import { environment }          from '../../../environments/environment';
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
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrls:  ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {
  private fb         = inject(FormBuilder);
  private auth       = inject(AuthService);
  private zone       = inject(NgZone);
  private router     = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private dialog     = inject(MatDialog);

  loginForm: FormGroup = this.fb.group({
    email:      ['', [Validators.required, Validators.email]],
    password:   ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
    rememberMe: [false]
  });

  loading = false;

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.loadGoogleScript();
  }

  private loadGoogleScript() {
    if (typeof window === 'undefined') return;
    if (window.google?.accounts?.id) {
      return this.initializeGoogleSignIn();
    }
    const script = document.createElement('script');
    script.src   = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => this.zone.run(() => this.initializeGoogleSignIn());
    document.head.appendChild(script);
  }

  private initializeGoogleSignIn() {
    window.google.accounts.id.initialize({
      client_id: environment.googleClient,
      callback:  (resp: any) => this.zone.run(() => this.handleGoogleCredential(resp))
    });
    window.google.accounts.id.renderButton(
      document.getElementById('googleSignInButton')!,
      { theme: 'outline', size: 'large' }
    );
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    const { email, password, rememberMe } = this.loginForm.value;
    this.loading = true;

    this.auth.login(email, password, rememberMe).pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        const msg = err.error?.error || 'Credenciales inválidas';
        const lower = msg.toLowerCase();
        if (lower.includes('correo') || lower.includes('email')) {
          this.loginForm.get('email')?.setErrors({ serverError: msg });
        } else {
          this.loginForm.get('password')?.setErrors({ serverError: msg });
        }
      }
    });
  }

  private handleGoogleCredential(resp: any) {
    this.loading = true;
    this.auth.loginWithGoogle(resp.credential).pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: () => this.zone.run(() => this.router.navigate(['/'])),
      error: (err) => {
        const msg = err.error?.error || 'Google login falló';
        this.loginForm.get('email')?.setErrors({ serverError: msg });
      }
    });
  }

  forgotPassword(): void {
    this.dialog.open(ForgotPasswordDialogComponent, { width: '360px' });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
