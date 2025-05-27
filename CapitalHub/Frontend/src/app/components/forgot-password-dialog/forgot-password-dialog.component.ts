import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule }  from '@angular/material/form-field';
import { MatInputModule }      from '@angular/material/input';
import { MatButtonModule }     from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule }        from '@angular/common';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './forgot-password-dialog.component.html',
  styleUrls: ['./forgot-password-dialog.component.css']
})
export class ForgotPasswordDialogComponent {
  private fb       = inject(FormBuilder);
  private auth     = inject(AuthService);
  private snack    = inject(MatSnackBar);
  public dialogRef = inject(MatDialogRef<ForgotPasswordDialogComponent>);

  loading = false;
  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.form.get('email')?.setErrors(null);
    const email = this.form.value.email;
    this.auth.forgotPassword(email).subscribe({
      next: () => {
        this.snack.open('Email de restablecimiento enviado', 'Cerrar', { duration: 5000 });
        this.dialogRef.close();
      },
      error: (err) => {
        this.loading = false;
        const msg = err.error?.error || 'Error enviando email';
        this.form.get('email')?.setErrors({ serverError: msg });
      }
    });
  }
}