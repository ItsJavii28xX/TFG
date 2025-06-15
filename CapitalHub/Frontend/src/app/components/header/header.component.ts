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

interface HelpPage {
  title: string;
  text: string;
  img:   string;
}

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

  showHelp = false;
  currentPage = 0;
  helpPages: HelpPage[] = [
    {
      title: 'INTRODUCCIÓN',
      text:  `Bienvenido a CapitalHub!! En esta aplicación podrás gestionar tus gastos personales, familiares o laborales de forma dinámica mediante grupos.`,
      img:   'favicon.ico'
    },
    {
      title: 'Inicio',
      text:  `Cuando inicias sesión, se crea automáticamente un grupo personal para gestionar tus propios gastos. Te recomendamos utilizarlo!`,
      img:   'PAG1.png'
    },
    {
      title: 'Opciones header',
      text:  `En la parte superior, encontrarás diversas opciones, entre las que se encuentran un buscador de grupos y usuarios, una lista de contactos y opciones de perfil.`,
      img:   'PAG2.png'
    },
    {
      title: 'Buscador',
      text:  `Para usar el buscador es muy sencillo, si introduces 3 o más caracteres, se mostrarán los usuarios y grupos que coincidan con el término de búsqueda.`,
      img:   'PAG3.png'
    },
    {
      title: 'Lista de contactos',
      text:  `Si pulsa en el botón de contactos, se desplegará una lista de todos los contactos que tenga agregados. Vea cómo agregar contactos en la siguiente página.`,
      img:   'PAG4.png'
    },
    {
      title: 'Añadir contactos',
      text:  `Al entrar en el perfil de un usuario de la aplicación, encontrará un botón llamado Añadir Contacto. Púlselo y ya tendrá como contacto a esa persona, así de fácil!`,
      img:   'PAG5.png'
    },
    {
      title: 'Opciones de perfil',
      text:  `Si pulsa en el botón de perfil, podrá acceder a su perfil personal o cerrar sesión. Si entra en su perfil, encontrará las opciones detalladas en la foto.`,
      img:   'PAG6.png'
    },
    {
      title: 'Filtrado',
      text:  `Si observa la pantalla de inicio, verá arriba a la izquierda una flecha. Si pulsa en ella, abrirá un panel con diversos filtros, úselos con sabiduría!`,
      img:   'PAG7.png'
    },
    {
      title: 'Gestión de grupos',
      text:  `En la esquina inferior derecha encontrará un botón azul, si pulsa en él abrirá un menú para gestionar los grupos: Añadir, borrar o actualizar grupos.`,
      img:   'PAG8.png'
    },
    {
      title: 'Añadir grupos',
      text:  `Si pulsa en añadir, se abrirá una ventana con los campos de nombre de grupo y las opciones de añadir miembros y presupuestos al grupo, ajústelo como prefiera y cree el grupo.`,
      img:   'PAG9.png'
    },
    {
      title: 'Borrar grupos',
      text:  `Si pulsa en borrar, se pondrán checkboxes sobre cada grupo, seleccione los que quiera borrar y confirme con el botón de la esquina inferior izquierda, ¡ten en cuenta que sólo podrá borrar los grupos en los que sea administrador!`,
      img:   'PAG10.png'
    },
    {
      title: 'Actualizar grupos',
      text:  `Si pulsa en actualizar, aparecerán iconos de editar debajo de cada grupo, seleccione el grupo que quiera editar y haga el cambio necesario.`,
      img:   'PAG11.png'
    },
    {
      title: 'Vista principal',
      text:  `Una vez tenga grupos creados, se dará cuenta de que aparecen tarjetas por cada uno de éstos. Cuentan con los datos del grupo, los presupuestos activos, que tendrán en verde los gastos aprobados y en amarillo los pendientes; los miembros que pertenecen al grupo y un botón de detalles, que le llevará al siguiente punto de la guía.`,
      img:   'PAG12.png'
    },
    {
      title: 'Detalles del grupo',
      text:  `En los detalles del grupo podrá observar varias secciones: lista completa de miembros del grupo; presupuestos, tanto activos como caducados, del grupo; gastos aceptados, pendientes y denegados. También verá un panel de gestión con opciones sobre cada una de las secciones mencionadas anteriormente. Necesita ser administrador para ver los gastos pendientes y poder acceder a las opciones de gestión de miembros y presupuestos.`,
      img:   'PAG13.png'
    },
    {
      title: 'Añadir gastos',
      text:  `Si pulsa en añadir un gasto, aparecerá una ventana con un formulario compuesto por un dropdown para seleccionar el presupuesto sobre el que quiera hacer el gasto, además del nombre del gasto, la cantidad y una descripción. No se pase del límite del presupuesto!!`,
      img:   'PAG14.png'
    },
    {
      title: 'Borrar gastos',
      text:  `Al pulsar en borrar gastos, sobre cada gasto se pondrá una checkbox para seleccionar los gastos aceptados o denegados que necesite.`,
      img:   'PAG15.png'
    },
    {
      title: 'Actualizar gastos',
      text:  `Si pulsa en actualizar, aparecerá una ventana con una lista de los gastos aceptados y pendientes. Seleccione el que quiera editar y rellene los campos, cuando pulse en siguiente, saldrá una ventana de confirmación listando todos los cambios.`,
      img:   'PAG16.png'
    },
    {
      title: 'Opciones footer',
      text:  `En la parte inferior de la pantalla verá las opciones para acceder a la política de privacidad y a los términos y condiciones de la aplicación.`,
      img:   'PAG17.png'
    }
  ];

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

  openHelp() {
    this.currentPage = 0;
    this.showHelp = true;
  }
  closeHelp() {
    this.showHelp = false;
  }
  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }
  nextPage() {
    if (this.currentPage < this.helpPages.length - 1) {
      this.currentPage++;
    }
  }

}

