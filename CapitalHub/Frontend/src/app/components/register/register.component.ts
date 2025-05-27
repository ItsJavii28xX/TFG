import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule }         from '@angular/router';
import { MatFormFieldModule }           from '@angular/material/form-field';
import { MatInputModule }               from '@angular/material/input';
import { MatButtonModule }              from '@angular/material/button';
import { MatCardModule }                from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule }                 from '@angular/common';

import { UserService, RegisterDto }     from '../../services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  private fb      = inject(FormBuilder);
  private userSvc = inject(UserService);
  private snack   = inject(MatSnackBar);
  private router  = inject(Router);

  form!: FormGroup;
  imagePreview: string | null = null;

  ngOnInit() {
    this.form = this.fb.group({
      nombre:        ['', Validators.required],
      apellidos:     ['', Validators.required],
      email:         ['', [Validators.required, Validators.email]],
      contraseña:    ['', [Validators.required, Validators.minLength(6)]],
      telefono:      ['', Validators.required],
      imagen_perfil: ['']
    });
  }

  /** Drag & drop */
  allowDrop(evt: DragEvent) { evt.preventDefault(); }
  onFileDropped(evt: DragEvent) {
    evt.preventDefault();
    const file = evt.dataTransfer?.files.item(0);
    if (file) this.handleFile(file);
  }

  /** File browse */
  fileBrowseHandler(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.item(0);
    if (file) this.handleFile(file);
  }

  /** Convert file to Base64 and patch form */
  private handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      this.form.patchValue({ imagen_perfil: reader.result });
    };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    if (this.form.invalid) return;
    const payload: RegisterDto = this.form.value;
    this.userSvc.register(payload).subscribe({
      next: () => {
        this.snack.open(
          'Usuario registrado, por favor inicia sesión',
          'Cerrar',
          { duration: 4000 }
        );
        this.router.navigate(['/login']);
      },
      error: err => {
        const msg = err.error.error || 'Error al registrar usuario';
        if (/email/i.test(msg)) {
          this.form.get('email')?.setErrors({ serverError: msg });
        } else {
          this.snack.open(msg, 'Cerrar', { duration: 4000 });
        }
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

}