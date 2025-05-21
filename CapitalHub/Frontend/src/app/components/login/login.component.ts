import { Component, OnInit }                     from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router }                                from '@angular/router';
import { MatInputModule }                        from '@angular/material/input';
import { MatButtonModule }                       from '@angular/material/button';
import { MatCheckboxModule }                     from '@angular/material/checkbox';
import { MatCardModule }                         from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule }        from '@angular/material/snack-bar';
import { CommonModule }                          from '@angular/common';

import { AuthService }                           from '../../services/auth.service';
import { environment }                           from '../../../environments/environment';
declare const google: any;

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
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  constructor(
    private fb:     FormBuilder,
    private auth:   AuthService,
    private snack:  MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    
    this.initializeGoogleSignIn();

    this.loginForm = this.fb.group({
      email:      ['', [Validators.required, Validators.email]],
      password:   ['', [Validators.required]],
      rememberMe: [false]
    });

  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    const { email, password, rememberMe } = this.loginForm.value;
    this.auth.login(email, password, rememberMe).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.snack.open('Credenciales inválidas', 'Cerrar', { duration: 3000 })
    });
  }

  initializeGoogleSignIn() {
    google.accounts.id.initialize({
      client_id: environment.googleClient,
      callback:  (resp: any) => this.handleGoogleCredential(resp)
    });
    google.accounts.id.renderButton(
      document.getElementById('googleSignInButton'),
      { theme: 'outline', size: 'large' }
    );
  }

  handleGoogleCredential(resp: any) {
    this.auth.loginWithGoogle(resp.credential).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.snack.open('Google login falló', 'Cerrar', { duration: 3000 })
    });
  }

  forgotPassword() {
    const email = prompt('Introduce tu email registrado:');
    if (!email) return;
    this.auth.forgotPassword(email).subscribe({
      next: () => this.snack.open('Email de restablecimiento enviado', 'Cerrar', { duration: 3000 }),
      error: () => this.snack.open('Error enviando email', 'Cerrar', { duration: 3000 })
    });
  }
}
