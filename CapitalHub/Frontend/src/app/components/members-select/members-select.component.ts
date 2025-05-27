import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatListModule }          from '@angular/material/list';
import { MatFormFieldModule }     from '@angular/material/form-field';
import { MatInputModule }         from '@angular/material/input';
import { MatButtonModule }        from '@angular/material/button';
import { MatIconModule }          from '@angular/material/icon';
import { MatCardModule }          from '@angular/material/card';
import { MatCheckboxModule }      from '@angular/material/checkbox';

import { ContactService } from '../../services/contact.service';
import { AuthService }    from '../../services/auth.service';

export interface Contact {
  id_contacto:   number;
  id_usuario:    number;
  nombre:        string;
  apellidos:     string;
  email?:        string;
  telefono?:     string;
  imagen_perfil?:string;
}

/** Payload que emitiremos al padre */
export interface MembersSelection {
  contacts: Contact[];
  asAdmin: boolean;
}

@Component({
  selector: 'app-members-select',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
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

  contacts: Contact[] = [];
  selected: Contact[] = [];
  form:     FormGroup;

  constructor(
    private contactSvc: ContactService,
    private authSvc:    AuthService,
    private fb:         FormBuilder
  ) {
    // Añadimos el control isAdmin aquí
    this.form = this.fb.group({
      manualEmail: ['', [Validators.email]],
      isAdmin:     [false]
    });
  }

  ngOnInit() {
    const uid = this.authSvc.getUserId()!;
    this.contactSvc.getAllContacts(uid)
      .subscribe(cs => {
        // eliminamos al propio usuario
        this.contacts = cs.filter(c => c.id_usuario !== uid);
      });
  }

  toggle(contact: Contact) {
    const idx = this.selected.findIndex(c => c.id_usuario === contact.id_usuario);
    if (idx >= 0) this.selected.splice(idx, 1);
    else this.selected.push(contact);
  }

  addManual() {
    const email = this.form.value.manualEmail?.trim();
    if (!email) return;
    this.contactSvc.findUserByEmail(email).subscribe(user => {
      if (user && !this.selected.find(c => c.id_usuario === user.id_usuario)) {
        this.selected.push(user);
      }
      this.form.get('manualEmail')!.reset();
    });
  }

  
  finish() {
    const uid = this.authSvc.getUserId()!;
    // Excluimos siempre al propio usuario de la selección
    const filtered = this.selected.filter(c => c.id_usuario !== uid);

    this.done.emit({
      contacts: filtered,
      asAdmin:  this.form.value.isAdmin
    });
  }

  close() {
    this.cancel.emit();
  }
}
