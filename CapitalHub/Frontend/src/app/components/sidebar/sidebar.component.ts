import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule }     from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Observable, of, switchMap, combineLatest, startWith, map } from 'rxjs';
import { Contacto, Usuario, ContactService } from '../../services/contact.service';
import { Group, GroupService } from '../../services/group.service';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatChip, MatChipGrid, MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatListItem, MatListModule, MatNavList } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatChip,
    MatChipGrid,
    MatIconModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatListModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
    trigger('openClose', [
      state('open', style({
        width: '300px',
        opacity: 1,
        borderRight: '2px solid #0e0e0e'
      })),
      state('closed', style({
        width: '0px',
        opacity: 0,
        borderRight: 'none'
      })),
      transition('open <=> closed', animate('200ms ease-in-out'))
    ])
  ]
})
export class SidebarComponent implements OnInit {

  @Input() status: 'open' | 'closed' = 'closed';

  /** Formulario reactivo con todos los filtros */
  filtersForm!: FormGroup;

  /** Lista completa de grupos (del backend) */
  allGroups: Group[] = [];

  /** Observable de grupos filtrados */
  filteredGroups$: Observable<Group[]> = of([]);

  /** Lista completa de contactos (del backend) */
  contactos: Contacto[] = [];

  /** Mapa de id_usuario → Usuario, para lookup rápido */
  contactosUsuariosMap: Record<number, Usuario> = {};

  /** Stream que alimenta el autocomplete de contactos */
  contactosUsuarios$: Observable<Usuario[]> = of([]);

  /** Control para el texto del autocomplete de contactos */
  public searchContactCtrl = new FormControl('');

  constructor(
    private fb: FormBuilder,
    private groupSvc: GroupService,
    private contactSvc: ContactService,
    private router: Router,
    private authSvc: AuthService
  ) {}

  ngOnInit() {
    // 1) Construimos el formulario con todos los controles
    this.filtersForm = this.fb.group({
      nombre: [''],
      miembrosSeleccionados: [[]],
      minMiembros: [0],
      presupuestosActivos: [false],
      fechaAntes: [null],
      fechaDespues: [null]
    });

    // 2) Traemos todos los grupos (con sus propiedades necesarias)
    this.groupSvc.createGetAllWithMembers(this.authSvc.getUserId()!).subscribe(grps => {
      this.allGroups = grps;
      this.setupFiltering();
    });

    // 3) Cargamos contactos → luego todos los Usuarios de cada uno
    const myId = this.authSvc.getUserId()!;
    this.contactSvc.getAllContactos(myId).pipe(
      switchMap((cs: Contacto[]) => {
        this.contactos = cs;
        if (cs.length === 0) {
          return of([] as Usuario[]);
        }
        // obtenemos usuario completo por cada contacto
        const peticiones = cs.map(c =>
          this.contactSvc.getUserById(c.id_usuario_contacto)
        );
        return combineLatest(peticiones);
      })
    ).subscribe((usuarios: Usuario[]) => {
      usuarios.forEach(u => {
        this.contactosUsuariosMap[u.id_usuario] = u;
      });
      this.contactosUsuarios$ = of(usuarios);
      // Si quieres filtrar en tiempo real:
      this.searchContactCtrl.valueChanges.pipe(
        startWith(''),
        map(txt => (typeof txt === 'string' ? txt.toLowerCase() : '')),
        map(txt =>
          usuarios.filter(u =>
            u.nombre.toLowerCase().includes(txt) ||
            u.apellidos.toLowerCase().includes(txt)
          )
        )
      ).subscribe((filtered: any) => {
        this.contactosUsuarios$ = of(filtered);
      });
    });
  }

  private setupFiltering() {
    // Extraemos cada control como un Observable de cambios
    const nombreCtrl$ = this.filtersForm.get('nombre')!.valueChanges.pipe(
      startWith(this.filtersForm.get('nombre')!.value)
    );
    const miembrosSel$ = this.filtersForm.get('miembrosSeleccionados')!.valueChanges.pipe(
      startWith(this.filtersForm.get('miembrosSeleccionados')!.value)
    );
    const minMiembros$ = this.filtersForm.get('minMiembros')!.valueChanges.pipe(
      startWith(this.filtersForm.get('minMiembros')!.value)
    );
    const presupuestos$ = this.filtersForm.get('presupuestosActivos')!.valueChanges.pipe(
      startWith(this.filtersForm.get('presupuestosActivos')!.value)
    );
    const antes$ = this.filtersForm.get('fechaAntes')!.valueChanges.pipe(
      startWith(this.filtersForm.get('fechaAntes')!.value)
    );
    const despues$ = this.filtersForm.get('fechaDespues')!.valueChanges.pipe(
      startWith(this.filtersForm.get('fechaDespues')!.value)
    );

    // Combinamos todos los controles para recalcular el filtrado al cambiar cualquiera
    this.filteredGroups$ = combineLatest([
      nombreCtrl$,
      miembrosSel$,
      minMiembros$,
      presupuestos$,
      antes$,
      despues$
    ]).pipe(
      map(([nombre, miembrosSel, minMiembros, presupuestosActivos, fechaAntes, fechaDespues]) => {
        return this.allGroups.filter(grupo => {
          // — Filtrar por nombre (substring case‐insensitive)
          if (nombre && nombre.trim().length > 0) {
            const txt = nombre.trim().toLowerCase();
            if (!grupo.nombre.toLowerCase().includes(txt)) {
              return false;
            }
          }

          // — Filtrar por miembros seleccionados (todos deben estar en el grupo)
          if (Array.isArray(miembrosSel) && miembrosSel.length > 0) {
            const integrantes: number[] = (grupo as any).miembros
              ? (grupo as any).miembros.map((u: Usuario) => u.id_usuario)
              : [];
            for (const idReq of miembrosSel as number[]) {
              if (!integrantes.includes(idReq)) {
                return false;
              }
            }
          }

          // — Filtrar por número mínimo de miembros
          if (minMiembros != null && !isNaN(minMiembros)) {
            const count = Array.isArray((grupo as any).miembros)
              ? (grupo as any).miembros.length
              : typeof (grupo as any).miembrosCount === 'number'
              ? (grupo as any).miembrosCount
              : 0;
            if (count < Number(minMiembros)) {
              return false;
            }
          }

          // — Filtrar por presupuestos activos
          if (presupuestosActivos) {
            if (!(grupo as any).tienePresupuestoActivo) {
              return false;
            }
          }

          // — Filtrar por fecha “Antes de”
          if (fechaAntes) {
            const fA = new Date(fechaAntes);
            if (new Date(grupo.fecha_creacion) > fA) {
              return false;
            }
          }
          // — Filtrar por fecha “Después de”
          if (fechaDespues) {
            const fD = new Date(fechaDespues);
            if (new Date(grupo.fecha_creacion) < fD) {
              return false;
            }
          }

          return true;
        });
      })
    );
  }

  /** Invocado cuando el usuario selecciona un contacto en el autocomplete */
  onMemberSelected(idSel: number) {
    const arr = this.filtersForm.get('miembrosSeleccionados')!.value as number[];
    if (!arr.includes(idSel)) {
      arr.push(idSel);
      this.filtersForm.get('miembrosSeleccionados')!.setValue(arr);
    }
    this.searchContactCtrl.setValue('');
  }

  /** Invocado para eliminar un “chip” de miembro seleccionado */
  removeMember(idRem: number) {
    const arr = this.filtersForm.get('miembrosSeleccionados')!.value as number[];
    const idx = arr.indexOf(idRem);
    if (idx >= 0) {
      arr.splice(idx, 1);
      this.filtersForm.get('miembrosSeleccionados')!.setValue(arr);
    }
  }

  clearFechaAntes() {
    this.filtersForm.get('fechaAntes')!.setValue(null);
  }
  clearFechaDespues() {
    this.filtersForm.get('fechaDespues')!.setValue(null);
  }

  /** Al hacer clic en un grupo filtrado, navegamos a su detalle */
  onGrupoClick(g: Group) {
    this.router.navigate(['/app-group-details', g.id_grupo]);
  }
}