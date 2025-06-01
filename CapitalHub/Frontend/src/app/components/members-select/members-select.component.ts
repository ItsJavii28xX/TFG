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
import { forkJoin }       from 'rxjs';
import { map }            from 'rxjs/operators';

/** Payload que emitiremos al componente padre */
export interface MembersSelection {
  contacts: Usuario[];
  admins:   number[];
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

  /** Aquí guardaremos la lista completa de `Usuario` obtenida del backend */
  allUsers: Usuario[] = [];
  /** Usuarios marcados como “seleccionados” */
  selected: Usuario[] = [];
  /** Mapa para saber si cada `id_usuario` está marcado como admin o no */
  adminMap: Record<number, boolean> = {};

  /** Campo “Correo manual” */
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

    // 1) Obtenemos todos los Contacto[] del usuario actual
    this.contactSvc.getAllContactos(uid).subscribe((cs: Contacto[]) => {
      // 2) Extraemos los IDs de id_usuario_contacto (sin incluirnos a nosotros mismos)
      const ids = cs
        .filter(c => c.id_usuario_contacto !== uid)
        .map(c => c.id_usuario_contacto);

      if (ids.length === 0) {
        // Si no hay contactos, no hacemos nada más
        return;
      }

      // 3) Para cada id, pedimos al backend el objeto Usuario completo
      const userRequests = ids.map(idUsuarioContacto =>
        this.contactSvc.getUserById(idUsuarioContacto)
      );

      // 4) forkJoin para esperar a que terminen todas las peticiones
      forkJoin(userRequests).subscribe((usuarios: Usuario[]) => {
        // Ya tenemos el array completo de Usuario[]
        this.allUsers = usuarios;
      });
    });
  }

  /**
   * Al hacer clic sobre un elemento:
   * - si ya estaba seleccionado, lo quitamos
   * - si no estaba, lo añadimos e inicializamos adminMap[id] = false
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

  isSelected(u: Usuario): boolean {
    return this.selected.some(x => x.id_usuario === u.id_usuario);
  }

  /**
   * “Añadir manual” busca el usuario por email, obtiene el Usuario completo,
   * y si existe y no estaba en `selected`, lo añade.
   */
  addManual() {
    const email = this.manualEmail?.trim();
    if (!email) return;

    this.contactSvc.findUserByEmail(email).subscribe((user: Usuario | undefined) => {
      if (!user) {
        // No existe un usuario con ese correo
        this.manualEmail = '';
        return;
      }

      // 1) Si no está en allUsers, lo agregamos para que aparezca en la lista
      const existeEnAll = this.allUsers.some(u => u.id_usuario === user.id_usuario);
      if (!existeEnAll) {
        this.allUsers.push(user);
      }

      // 2) Si aún no está seleccionado, lo añadimos a selected + adminMap[id] = false
      const yaSeleccionado = this.selected.some(x => x.id_usuario === user.id_usuario);
      if (!yaSeleccionado) {
        this.selected.push(user);
        this.adminMap[user.id_usuario] = false;
      }

      this.manualEmail = '';
    });
  }

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
}
