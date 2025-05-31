import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { MatListModule }          from '@angular/material/list';
import { MatFormFieldModule }     from '@angular/material/form-field';
import { MatInputModule }         from '@angular/material/input';
import { MatButtonModule }        from '@angular/material/button';
import { MatIconModule }          from '@angular/material/icon';
import { MatCardModule }          from '@angular/material/card';
import { MatCheckboxModule }      from '@angular/material/checkbox';

import { Contacto, ContactService, Usuario } from '../../services/contact.service';
import { AuthService }    from '../../services/auth.service';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';

/** 
 * Tipo ligero para mostrar en la lista. 
 * No confundirse con la entidad completa “Usuario” del backend.
 */
export interface UserPreview {
  id_usuario:    number;
  nombre:        string;
  apellidos:     string;
  imagen_perfil?:string;
  email?:        string;
  telefono?:     string;
}

/** Payload que emitiremos al componente padre */
export interface MembersSelection {
  contacts: UserPreview[];
  admins:   number[]; // IDs de usuarios marcados como admin
}

@Component({
  selector: 'app-members-select',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  templateUrl: './members-select.component.html',
  styleUrls: ['./members-select.component.css']
})
export class MembersSelectComponent implements OnInit {
  @Output() done   = new EventEmitter<MembersSelection>();
  @Output() cancel = new EventEmitter<void>();

  /** 
   * Aquí guardaremos la lista completa de usuarios obtenidos
   * a partir de todos los id_usuario_contacto que devolvió getAllContactos.
   */
  allUsers: Usuario[] = [];

  /** 
   * Usuarios que el usuario final ha marcado como "seleccionados"
   * (para incluir en el grupo).  
   */
  selected: Usuario[] = [];

  /**
   * Un mapa donde, para cada id_usuario que esté en “selected”,
   * almacenamos si lo marcó como administrador (true/false).
   */
  adminMap: Record<number, boolean> = {};

  /** Campo “Correo manual” en el formulario */
  manualEmail = '';

  form: FormGroup;

  constructor(
    private fb:         FormBuilder,
    private authSvc:    AuthService,
    private contactSvc: ContactService
  ) {
    this.form = this.fb.group({
      manualEmail: ['']
    });
  }

  ngOnInit() {
    const uid = this.authSvc.getUserId()!;

    // 1) Primero obtenemos TODOS los contactos (Contacto[]) del usuario actual:
    this.contactSvc.getAllContactos(uid).subscribe((cs: Contacto[]) => {
      // 2) Extraemos los IDs únicos de `id_usuario_contacto`
      const ids = cs
        .filter(c => c.id_usuario_contacto !== uid) // excluimos al propio usuario
        .map(c => c.id_usuario_contacto);

      if (ids.length === 0) {
        // Si no hay contactos, allUsers queda vacío
        this.allUsers = [];
        return;
      }

      // 3) Usamos forkJoin para, en paralelo, obtener cada Usuario por su id:
      const userObservables = ids.map(id => this.contactSvc.getUserById(id));

      forkJoin(userObservables).subscribe((usuarios: Usuario[]) => {
        // 4) Ya tenemos el array completo de Usuario[]:
        this.allUsers = usuarios;
      });
    });
  }

  /**
   * Cuando el usuario hace clic en un elemento de la lista:
   *  - si ya estaba en “selected”, lo quitamos --> eliminamos de selected y adminMap.
   *  - si no estaba, lo añadimos a “selected” y marcamos adminMap[id_usuario] = false inicialmente.
   */
  toggle(u: Usuario) {
    const idx = this.selected.findIndex(x => x.id_usuario === u.id_usuario);
    if (idx >= 0) {
      this.selected.splice(idx, 1);
      delete this.adminMap[u.id_usuario];
    } else {
      this.selected.push(u);
      this.adminMap[u.id_usuario] = false;
    }
  }

  /**
   * Helper para saber si el usuario ya está seleccionado:
   */
  isSelected(u: Usuario): boolean {
    return this.selected.some(x => x.id_usuario === u.id_usuario);
  }

  /**
   * Cuando el usuario pulsa “Listo”:
   *  - preparamos la lista `contacts = Usuario[]` (la copia de `this.selected`)
   *  - preparamos la lista `admins = number[]` (IDs de quienes adminMap[id] === true)
   *  - emitimos al padre.
   */
  onDone() {
    const contactos = this.selected.slice();
    const admins = Object.keys(this.adminMap)
      .filter(idStr => this.adminMap[+idStr])
      .map(idStr => Number(idStr));

    this.done.emit({ contacts: contactos, admins });
  }

  onCancel() {
    this.cancel.emit();
  }

  /**
   * “Añadir manual”:
   *  - busca al usuario completo mediante email
   *  - si existe y no está ya en “selected”, lo agrega y marca adminMap[id] = false
   */
addManual() {
  const email = this.manualEmail?.trim();
  if (!email) return;

  this.contactSvc.findUserByEmail(email)
    .subscribe((user: Usuario | undefined) => {
      // Si no existe usuario con ese correo, user será undefined
      if (!user) {
        this.manualEmail = '';
        return;
      }

      // Convertir Usuario → UserPreview (o al tipo que uses en 'selected')
      const preview: UserPreview = {
        id_usuario: user.id_usuario,
        nombre:     user.nombre,
        apellidos:  user.apellidos,
        imagen_perfil: user.imagen_perfil,
        email:      user.email,
        telefono:   user.telefono
      };

      // 1) Si no está en allUsers, añádelo ahí también (opcional, si quieres
      //    que aparezca en la lista junto a los contactos)
      const existsInAll = this.allUsers.some(u => u.id_usuario === preview.id_usuario);
      if (!existsInAll) {
        this.allUsers.push(preview);
      }

      // 2) Agregar a 'selected' solo si no estaba ya
      const alreadySelected = this.selected.some(u => u.id_usuario === preview.id_usuario);
      if (!alreadySelected) {
        this.selected.push(preview);
        this.adminMap[preview.id_usuario] = false; 
      }

      // Limpiar el input de correo
      this.manualEmail = '';
    });
}
}
