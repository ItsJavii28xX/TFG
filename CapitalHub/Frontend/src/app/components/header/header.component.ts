import { Component, OnInit }      from '@angular/core';
import { Router, RouterModule }   from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { Contact, Contacto, ContactService, Usuario } from '../../services/contact.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule }       from '@angular/material/button';
import { MatIconModule }         from '@angular/material/icon';
import { debounceTime, distinctUntilChanged, filter, switchMap, catchError, of, Observable } from 'rxjs';
import { Group, GroupService } from '../../services/group.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, MatIcon, CommonModule, MatMenuModule, MatDialogModule, MatButtonModule, MatIconModule, ReactiveFormsModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  /** Lista de contactos para el menú desplegable de "Contactos" */
  contacts: Contacto[] = [];

  /** Control para mostrar/ocultar el overlay de logout */
  showLogoutOverlay = false;

  /** FormControl para el input de búsqueda */
  public searchControl = new FormControl('');

  /** Observables que emitirán los resultados filtrados */
  public userResults$:  Observable<Usuario[]> = of([]);
  public groupResults$: Observable<Group[]>   = of([]);

  /** Indicador de que estamos buscando (p. ej. para mostrar un spinner) */
  public isSearching = false;

 

  constructor(
    private contactSvc: ContactService,
    private authSvc:    AuthService,
    private userSvc:    UserService,
    private groupSvc:   GroupService,
    public router:     Router
  ) {}

  ngOnInit() {
    // 1) Cargamos los contactos del usuario actual (para el dropdown de "Contactos")
    const me = this.authSvc.getUserId()!;
    this.contactSvc.getAllContactos(me).subscribe(cs => {
      this.contacts = cs;
    });

    // 2) Cuando cambie el texto en el FormControl de búsqueda...
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      filter((text): text is string => text !== null),
      distinctUntilChanged(),
      filter((text: string) => !!text && text.length >= 3)  // sólo si hay >= 3 chars
    ).subscribe((text: string) => {
      this.isSearching = true;

      // 2a) Buscar usuarios
      this.userSvc.searchUsers(text).pipe(
        catchError(() => of([])) // si falla, devolvemos array vacío
      ).subscribe((users: Usuario[]) => {
        this.userResults$ = of(users);
        this.isSearching = false;
      });

      // 2b) Buscar grupos
      this.groupSvc.searchGroups(text, me).pipe(
        catchError(() => of([]))
      ).subscribe((groups: Group[]) => {
        this.groupResults$ = of(groups);
        this.isSearching = false;
      });
    });
  }

  /** Al hacer clic en un usuario buscado, navegamos a su perfil */
  goToUserProfile(u: Usuario) {
    this.router.navigate(['/perfil', u.id_usuario]);
    this.searchControl.setValue(''); // limpiar el texto y los resultados
  }

  /** Al hacer clic en un grupo buscado, navegamos a la vista de ese grupo */
  goToGroupDetail(g: Group) {
    this.router.navigate(['/grupos', g.id_grupo]);
    this.searchControl.setValue('');
  }

  /** Navegar al propio perfil */
  goToPersonal() {
    this.router.navigate(['/personal']);
  }

  /** Navegar al perfil de un contacto específico */
  goToContactProfile(contact: Contacto) {
    this.router.navigate(['/perfil', contact.id_usuario_contacto]);
  }

  /** Cerrar solo la sesión actual */
  logoutCurrent() {
    this.authSvc.logoutCurrent().subscribe(() => {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      this.router.navigate(['/login']);
    });
  }

  /** Cerrar sesión en todos los dispositivos */
  logoutAll() {
    this.authSvc.logoutAll().subscribe(() => {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      this.router.navigate(['/login']);
    });
  }
}

