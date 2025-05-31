import { Component, OnInit }      from '@angular/core';
import { Router, RouterModule }   from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { Contact, Contacto, ContactService } from '../../services/contact.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule }       from '@angular/material/button';
import { MatIconModule }         from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, MatIcon, CommonModule, MatMenuModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  contacts: Contacto[] = [];
  showLogoutOverlay = false;

  constructor(
    private contactSvc: ContactService,
    private authSvc:    AuthService,
    public router:     Router
  ) {}

  ngOnInit() {
    const me = this.authSvc.getUserId()!;
    this.contactSvc.getAllContactos(me).subscribe(cs => this.contacts = cs);
  }

  goToPersonal() {
    this.router.navigate(['/personal']);
  }

  goToContactProfile(contact: Contacto) {
    console.log('Navigating to contact profile:', contact.id_usuario_contacto);
    this.router.navigate(['/perfil', contact.id_usuario_contacto]);
  } 

  /** cerrar sólo la sesión actual */
  logoutCurrent() {
    this.authSvc.logoutCurrent().subscribe(() => {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      this.router.navigate(['/login']);
    });
  }

  /** cerrar sesión en todos los dispositivos */
  logoutAll() {
    this.authSvc.logoutAll().subscribe(() => {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      this.router.navigate(['/login']);
    });
  }
}

