import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule }             from '@angular/router';
import { MatInputModule }      from '@angular/material/input';
import { MatButtonModule }     from '@angular/material/button';
import { MatCardModule }       from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule }        from '@angular/common';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  private fb    = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private auth  = inject(AuthService);
  private snack = inject(MatSnackBar);
  private router= inject(Router);

  form!: FormGroup;
  token?: string;
  serverError?: string;

  ngOnInit() {
    // 1) Captura token de la query
    this.token = this.route.snapshot.queryParamMap.get('token') || undefined;
    // Si no hay token, redirige o muestra mensaje
    if (!this.token) {
      this.router.navigate(['/login']);
      return;
    }

    // 2) Crea el formulario
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirm:     ['', [Validators.required]]
    }, {
      validators: this.matchPasswords('newPassword','confirm')
    });
  }

  // Validator para comparar newPassword y confirm
  private matchPasswords(passKey: string, confirmKey: string) {
    return (group: FormGroup) => {
      const pass    = group.controls[passKey];
      const confirm = group.controls[confirmKey];
      if (pass.value !== confirm.value) {
        confirm.setErrors({ mismatch: true });
      } else {
        confirm.setErrors(null);
      }
      return null;
    };
  }

  onSubmit() {
    if (this.form.invalid || !this.token) return;
    this.serverError = undefined;
    const { newPassword } = this.form.value;
    this.auth.resetPassword(this.token, newPassword).subscribe({
      next: () => {
        this.snack.open('Contraseña restablecida con éxito', 'Cerrar', { duration: 5000 });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        const msg = err.error?.error || 'Error al restablecer contraseña';
        this.serverError = msg;
      }
    });
  }
}
