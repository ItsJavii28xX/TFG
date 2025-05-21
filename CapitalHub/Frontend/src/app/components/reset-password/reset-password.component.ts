import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  token!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private auth: AuthService,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {

    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatch });

    // Leer y validar token de la URL
    const tokenParam = this.route.snapshot.queryParamMap.get('token');
    if (!tokenParam) {
      this.snack.open('Enlace inválido', 'Cerrar', { duration: 3000 });
      this.router.navigate(['/login']);
      return;
    }
    this.token = tokenParam;
  }

  private passwordsMatch(group: FormGroup) {
    const pw = group.get('newPassword')?.value;
    const cpw = group.get('confirmPassword')?.value;
    return pw === cpw ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.resetForm.invalid) return;
    // Aseguramos a TS que newPassword existe
    const newPassword = this.resetForm.value.newPassword as string;
    this.auth.resetPassword(this.token, newPassword).subscribe({
      next: () => {
        this.snack.open('Contraseña restablecida', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/login']);
      },
      error: () => {
        this.snack.open('Error al restablecer', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
