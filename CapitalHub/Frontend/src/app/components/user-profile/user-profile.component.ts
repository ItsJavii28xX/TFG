import { Component, OnInit }                       from '@angular/core';
import { ActivatedRoute, Router }                  from '@angular/router';
import { CommonModule }                            from '@angular/common';
import { MatCardModule }                           from '@angular/material/card';
import { MatButtonModule }                         from '@angular/material/button';
import { ContactService, ContactoCrear }           from '../../services/contact.service';
import { AuthService, User }                       from '../../services/auth.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user?: User;
  adding    = false;
  added     = false;
  isMe      = false;

  private meId!: number;

  constructor(
    private route:       ActivatedRoute,
    private router:      Router,
    private contactSvc:  ContactService,
    private authSvc:     AuthService
  ) {}

  ngOnInit() {
    this.meId = this.authSvc.getUserId()!;
    const id  = Number(this.route.snapshot.paramMap.get('id'));
    this.isMe = id === this.meId;

    // 1) Traer datos del usuario
    this.authSvc.getUserById(id).subscribe(u => {
      this.user = u;

      // 2) Verificar si ya es contacto
      this.contactSvc.getAllContactos(this.meId)
        .subscribe(list => {
          this.added = list.some(c => c.id_usuario_contacto === id);
        });
    });
  }

  onAddContact() {
    if (!this.user) return;
    this.adding = true;

    const payload: ContactoCrear = {
      id_usuario_contacto: this.user.id_usuario,
      nombre:              this.user.nombre,
      apellidos:           this.user.apellidos,
      email:               this.user.email  || '',
      telefono:            this.user.telefono,
      imagen_perfil:       this.user.imagen_perfil
    };

    this.contactSvc.addContact(this.meId, payload)
      .subscribe({
        next: () => {
          this.adding = false;
          this.added  = true;
        },
        error: () => {
          this.adding = false;
          console.error('Error al añadir contacto');
        }
      });
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
