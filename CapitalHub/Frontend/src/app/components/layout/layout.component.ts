// src/app/components/layout/layout.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, RouterModule, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent }   from '../header/header.component';
import { FooterComponent }   from '../footer/footer.component';
import { SidebarComponent }  from '../sidebar/sidebar.component';
import { GroupService, Group } from '../../services/group.service';
import { Router } from '@angular/router';
import { filter, forkJoin } from 'rxjs';
import { map, switchMap }    from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { AnimationTriggerMetadata, trigger, transition, style, animate, group, query, keyframes } from '@angular/animations';


export const epicFlipAnimation = trigger('routeAnimations', [
  // de HomePage a DetailsPage
  transition('HomePage => DetailsPage', [
    style({ position: 'relative', perspective: '1200px' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '100%',
        transformStyle: 'preserve-3d'
      })
    ], { optional: true }),
    group([
      // cartão que sale
      query(':leave', [
        animate('800ms ease-in', keyframes([
          style({ offset: 0,    transform: 'rotateY(0)   translateZ(0)',       opacity: 1 }),
          style({ offset: 0.3,  transform: 'rotateY(-30deg) translateZ(-100px)', opacity: 0.8 }),
          style({ offset: 1.0,  transform: 'rotateY(-90deg) translateZ(-400px)', opacity: 0 })
        ]))
      ], { optional: true }),
      // cartão que entra
      query(':enter', [
        style({ transform: 'rotateY(90deg) translateZ(-400px)', opacity: 0 }),
        animate('800ms ease-out', keyframes([
          style({ offset: 0,    transform: 'rotateY(90deg)  translateZ(-400px)', opacity: 0 }),
          style({ offset: 0.7,  transform: 'rotateY(30deg)  translateZ(-100px)', opacity: 0.8 }),
          style({ offset: 1.0,  transform: 'rotateY(0)      translateZ(0)',       opacity: 1 })
        ]))
      ], { optional: true })
    ])
  ]),

  // de DetailsPage a HomePage (la vuelta)
  transition('DetailsPage => HomePage', [
    style({ position: 'relative', perspective: '1200px' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '100%',
        transformStyle: 'preserve-3d'
      })
    ], { optional: true }),
    group([
      // cartão actual gira fuera
      query(':leave', [
        animate('700ms ease-in', keyframes([
          style({ offset: 0,    transform: 'rotateY(0)   translateZ(0)',       opacity: 1 }),
          style({ offset: 0.3,  transform: 'rotateY(30deg) translateZ(-100px)', opacity: 0.8 }),
          style({ offset: 1.0,  transform: 'rotateY(90deg) translateZ(-400px)', opacity: 0 })
        ]))
      ], { optional: true }),
      // novo cartão gira dentro
      query(':enter', [
        style({ transform: 'rotateY(-90deg) translateZ(-400px)', opacity: 0 }),
        animate('700ms ease-out', keyframes([
          style({ offset: 0,    transform: 'rotateY(-90deg) translateZ(-400px)', opacity: 0 }),
          style({ offset: 0.7,  transform: 'rotateY(-30deg) translateZ(-100px)', opacity: 0.8 }),
          style({ offset: 1.0,  transform: 'rotateY(0)      translateZ(0)',       opacity: 1 })
        ]))
      ], { optional: true })
    ])
  ])
]);

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    HeaderComponent,
    FooterComponent,
    SidebarComponent
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  animations: [ epicFlipAnimation ]
})
export class LayoutComponent implements OnInit {
  collapsed        = true;
  optionsOpen      = false;
  showAddForm      = false;
  deleteMode       = false;
  updateMode       = false;
  selectedToDelete = new Set<number>();
  showProfile      = false;

  /** Listado de grupos inválidos (id + nombre) */
  invalidGroups: Array<{ id: number; nombre: string }> = [];

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  /** Controla si se ve el overlay de advertencia */
  showInvalidOverlay = false;

  showGroupDetails = false;

  constructor(
    private groupSvc: GroupService,
    private authSvc:  AuthService,
    private router:   Router
  ) {}

  ngOnInit() {
    // Cada vez que cambie la ruta, actualizamos showProfile
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.showProfile = this.router.url.startsWith('/perfil');
      });
  }

  toggleSidebar() { this.collapsed = !this.collapsed; }
  toggleOptions() { this.optionsOpen = !this.optionsOpen; }

  openAddForm() {
    this.optionsOpen = false;
    this.showAddForm = true;
  }
  onAddCancel()    { this.showAddForm = false; }
  onGroupCreated() { this.showAddForm = false; }

  openDeleteForm() {
    this.optionsOpen        = false;
    this.deleteMode         = true;
    this.selectedToDelete.clear();
    this.invalidGroups      = [];
    this.showInvalidOverlay = false;
  }

  cancelDelete() {
    this.deleteMode         = false;
    this.selectedToDelete.clear();
    this.invalidGroups      = [];
    this.showInvalidOverlay = false;
  }

  onSelectionChange(ids: Set<number>) {
    this.selectedToDelete = ids;
  }

  confirmDelete() {
    const toDelete = Array.from(this.selectedToDelete);
    const currentUserId = this.authSvc.getUserId()!;

    if (toDelete.length === 0) {
      return;
    }

    // 1) Para cada grupo, comprobamos si soy admin
    //    y después pedimos el nombre del grupo
    const checksWithName$ = toDelete.map(grupoId =>
      this.groupSvc.checkIfAdmin(currentUserId, grupoId).pipe(
        switchMap(isAdmin =>
          this.groupSvc.getById(grupoId).pipe(
            map((grp: Group) => ({
              id: grupoId,
              nombre: grp.nombre,
              isAdmin
            }))
          )
        )
      )
    );

    // 2) Cuando terminen todas las comprobaciones + lecturas de nombre:
    forkJoin(checksWithName$).subscribe(results => {
      // results = [{ id, nombre, isAdmin }, ...]
      const gruposValidados = results
        .filter(r => r.isAdmin)
        .map(r => r.id);

      // Construimos la lista de inválidos (id + nombre)
      this.invalidGroups = results
        .filter(r => !r.isAdmin)
        .map(r => ({ id: r.id, nombre: r.nombre }));

      // 3) Si hay grupos válidos, los borramos sin cerrar aún el overlay
      if (gruposValidados.length > 0) {
        this.groupSvc.deleteGroupCascade(gruposValidados).subscribe(
          () => {
            // Hemos borrado los válidos en segundo plano.
            // **NO** llamamos a cancelDelete() aquí, porque aún podría haber inválidos
            // que deben quedar visibles en el overlay hasta que el usuario lo confirme.
          },
          err => {
            console.error('Error borrando los grupos válidos:', err);
          }
        );
      }

      // 4) Si hay al menos un inválido, abrimos el overlay.
      //    Si no hay inválidos, podemos cerrar directamente el modo delete.
      if (this.invalidGroups.length > 0) {
        this.showInvalidOverlay = true;
      } else {
        // No había inválidos → salimos del modo delete
        this.cancelDelete();
        this.optionsOpen = false;
      }
    });
  }

  /** Pulsar "Confirmar" en el overlay de errores */
  onInvalidConfirm() {
    this.showInvalidOverlay = false;
    this.cancelDelete();
  }

  /** Pulsar "Cancelar" en el overlay de errores */
  onInvalidCancel() {
    this.showInvalidOverlay = false;
    // Deja vivo el modo delete para que el usuario pueda cambiar selección
  }

  // ** NUEVO: edición **
  openUpdateForm() {
    this.optionsOpen = false;
    this.updateMode  = true;
    this.deleteMode  = false;
  }
  cancelUpdate() {
    this.updateMode = false;
  }
}
