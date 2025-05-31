import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { User, AuthService } from '../../services/auth.service';
import { ContactService } from '../../services/contact.service';
import { MatCard, MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { UserDto, UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatFormFieldModule, MatLabel, FormsModule, MatInputModule],
  templateUrl: './personal.component.html',
  styleUrl: './personal.component.css'
})
export class PersonalComponent implements OnInit {
  user!: UserDto;

  // EDICIÓN DE INFO
  editingInfo   = false;
  edit: Partial<User> = {};
  infoWarning   = '';       // Mensaje de advertencia (por ejemplo, cuenta Google)
  infoError     = '';       // Mensaje de error para “Editar mi información”
  showInfoConfirm = false;  // Control del overlay de confirmación
                            // para “Confirmar cambios de info”

  // CONTRASEÑA
  showPwdForm = false;
  pwd = { current: '', new: '', confirm: '' };
  pwdError   = '';          // Mensaje de error para cambiar contraseña

  // BORRAR CUENTA
  showDeleteConfirm = false;

  private meId!: number;

  idsToDelete: number[] = []; // IDs de contactos a eliminar (si se implementa)
  usersToDelete: number[] | undefined;

  constructor(
    private authSvc: AuthService,
    private userSvc: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.meId = this.authSvc.getUserId()!;
    this.loadMyData();
  }

  private loadMyData() {
    this.authSvc.getUserById(this.meId).subscribe(u => {
      this.user = u;
    });
  }

  // -----------------------
  //  1) EDICIÓN DE INFO
  // -----------------------

  startEditInfo() {
    // Limpiamos mensajes previos
    this.infoWarning = '';
    this.infoError   = '';

    // Llamamos a isGoogleUser() y nos suscribimos:
    this.authSvc.isGoogleUser().subscribe(isGoogle => {
      if (isGoogle) {
        // Si realmente viene de Google, mostramos el mensaje en la tarjeta
        this.infoWarning = 'Tu cuenta proviene de Google. Modifica tus datos en tu cuenta Google.';
        return; // Salimos sin activar el modo edición
      }

      // Si NO viene de Google, abrimos el formulario de edición:
      this.editingInfo = true;
      this.edit = {
        nombre: this.user.nombre,
        apellidos: this.user.apellidos,
        email: this.user.email,
        telefono: this.user.telefono
      };
    }, err => {
      // En caso de error de red/API, podemos mostrar algo
      console.error('Error al verificar proveedor de OAuth:', err);
      this.infoError = 'No se pudo verificar el tipo de cuenta. Intenta de nuevo más tarde.';
    });
  }

  cancelEditInfo() {
    this.editingInfo = false;
    this.edit = {};
    this.infoError = '';
    this.infoWarning = '';
    this.showInfoConfirm = false;
  }

  // Abrir el overlay de confirmación
  openInfoConfirm() {
    // Validar campos mínimos
    if (!this.edit.nombre || !this.edit.apellidos || !this.edit.email) {
      this.infoError = 'Los campos Nombre, Apellidos y Email son obligatorios.';
      return;
    }
    this.infoError = '';
    this.showInfoConfirm = true;
  }

  // Cerrar overlay de confirmación sin aplicar cambios
  closeInfoConfirm() {
    this.showInfoConfirm = false;
  }

  // Confirmar finalmente la edición de datos
  doEditInfo() {
    const payload: Partial<User> = {
      nombre: this.edit.nombre!,
      apellidos: this.edit.apellidos!,
      email: this.edit.email!,
      telefono: this.edit.telefono || ''
    };
    this.userSvc.update(this.meId, payload).subscribe({
      next: () => {
        this.showInfoConfirm = false;
        this.editingInfo = false;
        this.loadMyData();
      },
      error: err => {
        // Mostrar error en caso de fallo HTTP
        this.infoError = 'Ocurrió un error al actualizar tu información. Inténtalo de nuevo.';
      }
    });
  }


  // -----------------------
  //  2) CAMBIAR CONTRASEÑA
  // -----------------------
  changePassword() {
    // Limpiamos mensaje previo
    this.pwdError = '';

    if (this.pwd.new !== this.pwd.confirm) {
      this.pwdError = 'La nueva contraseña y su confirmación no coinciden.';
      return;
    }
    if (!this.pwd.current) {
      this.pwdError = 'Por favor, ingresa tu contraseña actual.';
      return;
    }
    // Verificamos que la actual coincida
    this.userSvc.verifyPassword(this.meId, this.pwd.current).subscribe(ok => {
      if (!ok) {
        this.pwdError = 'Contraseña actual incorrecta.';
      } else {
        // Si coincide, hacemos la actualización
        this.userSvc.update(this.meId, { contraseña: this.pwd.new }).subscribe({
          next: () => {
            // Mensaje “exitoso” dentro de la propia tarjeta (se podría reemplazar por Snackbar)
            this.pwdError = '';
            this.showPwdForm = false;
            this.pwd = { current: '', new: '', confirm: '' };
          },
          error: () => {
            this.pwdError = 'Error al actualizar la contraseña. Inténtalo de nuevo.';
          }
        });
      }
    });
  }


  // -----------------------
  //  3) BORRAR CUENTA
  // -----------------------
  deleteAccount() {
    this.usersToDelete = [this.meId]; // Por ahora solo el propio usuario
    this.userSvc.deleteUserCascade(this.usersToDelete).subscribe({
      next: () => {
        // Borramos tokens localmente y redirigimos a login
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        this.router.navigate(['/login']);
      },
      error: () => {
        alert('No se pudo eliminar tu cuenta. Inténtalo más tarde.');
      }
    });
  }


  // -----------------------
  //  Helpers
  // -----------------------
  goHome() {
    this.router.navigate(['/home']);
  }
}