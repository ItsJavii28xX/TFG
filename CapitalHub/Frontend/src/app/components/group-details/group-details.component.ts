import { Component, OnInit, ViewEncapsulation }  from '@angular/core';
import { ActivatedRoute, Router }     from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Grupo, GroupService }     from '../../services/group.service';
import { Contact, ContactService, Usuario } from '../../services/contact.service';
import { BudgetService, Budget }   from '../../services/budget.service';
import { GastoService, Gasto }     from '../../services/gasto.service';

import { Observable, BehaviorSubject, combineLatest, of, Subject, forkJoin } from 'rxjs';
import { map, startWith, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { MatList, MatListModule } from '@angular/material/list';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatOption, MatOptionModule } from '@angular/material/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MembersSelectComponent, MembersSelection } from '../members-select/members-select.component';

@Component({
  selector: 'app-group-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatLabel,
    MatButton,
    MatListModule,
    MatDatepickerModule,
    CommonModule,
    MatIcon,
    MatCard,
    MatCheckbox,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MembersSelectComponent,
    MatCardModule
  ],
  providers: [DatePipe],
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.css']
})
export class GroupDetailsComponent implements OnInit {
  groupId!: number;
  private reloadGroup$ = new Subject<void>();
  group$!: Observable<Grupo>;


  isAdmin!: boolean;

  // PAGINACIÓN miembros
  private membersRawSubject = new BehaviorSubject<Contact[]>([]);
  pageIndex$ = new BehaviorSubject<number>(0);
  readonly pageSize = 3;
  totalPages = 1;
  members$!: Observable<Contact[]>;

  acceptedExpenses: Gasto[] = [];
  pendingExpenses:  Gasto[] = [];
  deniedExpenses:   Gasto[] = [];

  pageIndex = { accepted: 0, pending: 0, denied: 0 };
  totalPagesExpenses = { accepted: 1, pending: 1, denied: 1 };
  readonly pageSizeExpenses = 3;

  // STREAMS
  budgets$!: Observable<Budget[]>;
  gastos$!: Observable<Gasto[]>;

  // FORMS inline
  addMemberForm!: FormGroup;
  addBudgetForm!: FormGroup;
  addExpenseForm!: FormGroup;
  updateBudgetForm!: FormGroup;
  updateExpenseForm!: FormGroup;

  // Arrays de selección
  selectedMembers: Contact[] = [];
  selectedBudgets: Budget[]   = [];
  selectedExpenses: Gasto[]  = [];

  // Flags para modal de confirmación
  showConfirmDeleteMembers  = false;
  showConfirmDeleteBudgets  = false;
  showConfirmDeleteExpenses = false;

  showEditBudgetOverlay   = false;
  showReviewBudgetOverlay = false;

  // Budget seleccionado originalmente y formulario de edición
  budgetToEditOverlay?: Budget;
  editBudgetForm!: FormGroup;

  // Para tener la lista de budgets en memoria rápida
  budgetsSnapshot: Budget[] = [];

  // PARA EL OVERLAY DE EDICIÓN UNO-A-UNO
  activeBudgets: Budget[] = [];
  budgetIndex   = 0;
  totalBudgets  = 0;

  expiredBudgets: Budget[] = [];
  budgetView: 'active' | 'expired' = 'active';
  
  showAddExpenseOverlay = false;
  addExpenseOverlayForm!: FormGroup;

  // FLAGS de UI
  showAddMemberForm    = false;
  deleteMemberMode     = false;

  showAddBudgetForm    = false;
  deleteBudgetMode     = false;
  updateBudgetMode     = false;
  budgetToEdit?: Budget;

  showAddExpenseForm   = false;
  deleteExpenseMode    = false;
  updateExpenseMode    = false;
  expenseToEdit?: Gasto;

  // lista de contactos para el selector
  allContacts$!: Observable<Contact[]>;

  reviewChanges: { field: string; before: string; after: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private groupSvc: GroupService,
    private contactSvc: ContactService,
    private budgetSvc: BudgetService,
    private gastoSvc: GastoService,
    private authSvc: AuthService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    // ① ¡Primero! recupera el parámetro de ruta
    this.groupId = Number(this.route.snapshot.paramMap.get('id_grupo'));

    this.group$ = this.reloadGroup$.pipe(
      startWith(void 0),
      switchMap(() => this.groupSvc.buscarGrupoPorId(this.groupId))
    );

    this.reloadGroup$.pipe(
      startWith(void 0),
      switchMap(() => this.gastoSvc.getByGroup(this.groupId)),
      tap(all => this.splitExpenses(all))
    ).subscribe();

    // ② Carga budgets (y pártelos)
    this.budgets$ = this.reloadGroup$.pipe(
      startWith(void 0),
      switchMap(() => this.budgetSvc.getByGroup(this.groupId)),
      tap(all => {
        this.splitBudgets(all);
        this.budgetsSnapshot = all;
      })
    );

    // ③ Carga gastos
    this.gastos$ = this.reloadGroup$.pipe(
      startWith(void 0),
      switchMap(() => this.gastoSvc.getByGroup(this.groupId))
    );

    const userId = this.authSvc.getUserId()!;
    if (userId != null) {
      this.groupSvc.checkIfAdmin(userId, this.groupId)
        .subscribe(isAdmin => this.isAdmin = isAdmin);
    } else {
      this.isAdmin = false;
    }
      

    console.log(userId, this.groupId, this.isAdmin);

    this.editBudgetForm = this.fb.group({
      id_presupuesto: [null],
      nombre: ['', Validators.required],
      descripcion: [''],
      cantidad: [0, [Validators.required, Validators.min(0.01)]],
      fecha_fin: [null, Validators.required]
    });

    // ① Carga todos y filtra activos
    const today = new Date();
    this.budgetSvc.getByGroup(this.groupId)
      .pipe(take(1))
      .subscribe(all => {
        this.activeBudgets  = all.filter(b => new Date(b.fecha_fin) > today);
        this.expiredBudgets = all.filter(b => new Date(b.fecha_fin) <= today);

        this.totalBudgets = this.activeBudgets.length;
        this.budgetsSnapshot = all;
      });

    this.gastos$  = this.gastoSvc.getByGroup(this.groupId);

    // ② carga la lista y emítela en el subject
    this.contactSvc.getMembersByGroup(this.groupId)
      .subscribe(list => this.membersRawSubject.next(list));

    // ③ define members$ combinando el subject y la paginación
    this.members$ = combineLatest([
      this.membersRawSubject,
      this.pageIndex$
    ]).pipe(
      map(([all, idx]) => {
        this.totalPages = Math.max(Math.ceil(all.length / this.pageSize), 1);
        // ajusta índice si sale de rango
        const page = Math.min(Math.max(idx, 0), this.totalPages - 1);
        if (page !== idx) this.pageIndex$.next(page);
        return all.slice(page * this.pageSize, page * this.pageSize + this.pageSize);
      })
    );
    this.allContacts$ = this.contactSvc.getAllContacts(this.authSvc.getCurrentUser().id_usuario);

    // 3) presupuestos y gastos
    this.budgets$ = this.budgetSvc.getByGroup(this.groupId).pipe(
      tap(all => this.splitBudgets(all))
    );
    this.gastos$  = this.gastoSvc.getByGroup(this.groupId);
    this.initAddExpenseForm();

    // 4) formularios
    this.addMemberForm    = this.fb.group({ id_usuario_contacto: [null] });
    this.addBudgetForm    = this.fb.group({ nombre: [''], cantidad: [0], fechaInicio: [null], fechaFin: [null] });
    this.updateBudgetForm = this.fb.group({ id_presupuesto: [null], nombre: [''], cantidad: [0], fecha_inicio: [null], fecha_fin: [null] });
    this.addExpenseForm   = this.fb.group({ descripcion: [''], cantidad: [0] });
    this.updateExpenseForm= this.fb.group({ id_gasto: [null], descripcion: [''], cantidad: [0] });
  }

  private initAddExpenseForm() {
    this.addExpenseOverlayForm = this.fb.group({
      id_presupuesto: [null, Validators.required],
      nombre: ['', Validators.required],
      cantidad: [0, [Validators.required, Validators.min(0.01)]],
      descripcion: ['']
    });
  }

  private splitBudgets(all: Budget[]) {
    const today = new Date();
    this.activeBudgets  = all.filter(b => new Date(b.fecha_fin) > today);
    this.expiredBudgets = all.filter(b => new Date(b.fecha_fin) <= today);
  }

  private splitExpenses(all: Gasto[]) {
    this.acceptedExpenses = all.filter(g => g.estado === 'aceptado');
    this.pendingExpenses  = all.filter(g => g.estado === 'pendiente');
    this.deniedExpenses   = all.filter(g => g.estado === 'denegado');

    this.totalPagesExpenses.accepted = Math.max(1, Math.ceil(this.acceptedExpenses.length / this.pageSizeExpenses));
    this.totalPagesExpenses.pending  = Math.max(1, Math.ceil(this.pendingExpenses.length  / this.pageSizeExpenses));
    this.totalPagesExpenses.denied   = Math.max(1, Math.ceil(this.deniedExpenses.length   / this.pageSizeExpenses));

    // Ajusta índices fuera de rango:
    (['accepted','pending','denied'] as const).forEach(section => {
      if (this.pageIndex[section] >= this.totalPagesExpenses[section]) {
        this.pageIndex[section] = this.totalPagesExpenses[section] - 1;
      }
    });
  }

  get acceptedPage() {
    const start = this.pageIndex.accepted * this.pageSize;
    return this.acceptedExpenses.slice(start, start + this.pageSize);
  }
  get pendingPage() {
    const start = this.pageIndex.pending * this.pageSize;
    return this.pendingExpenses.slice(start, start + this.pageSize);
  }
  get deniedPage() {
    const start = this.pageIndex.denied * this.pageSize;
    return this.deniedExpenses.slice(start, start + this.pageSize);
  }

  prevPageExpenses(section: 'accepted'|'pending'|'denied') {
    if (this.pageIndex[section] > 0) this.pageIndex[section]--;
  }
  nextPageExpenses(section: 'accepted'|'pending'|'denied') {
    if (this.pageIndex[section] + 1 < this.totalPagesExpenses[section]) this.pageIndex[section]++;
  }

  approve(g: Gasto) {
    this.gastoSvc.update(g.id_gasto, { estado: 'aceptado' })
      .pipe(
        switchMap(() => this.gastoSvc.getByGroup(this.groupId))
      )
      .subscribe(all => this.splitExpenses(all));
  }
  deny(g: Gasto) {
    this.gastoSvc.update(g.id_gasto, { estado: 'denegado' })
      .pipe(
        switchMap(() => this.gastoSvc.getByGroup(this.groupId))
      )
      .subscribe(all => this.splitExpenses(all));
  }

  setBudgetView(view: 'active' | 'expired') {
    this.budgetView = view;
  }

  toggleSelectMember(u: Contact, checked: boolean) {
    if (checked) {
      this.selectedMembers.push(u);
    } else {
      this.selectedMembers = this.selectedMembers.filter(x => x.id_usuario !== u.id_usuario);
    }
  }
  toggleSelectBudget(b: Budget, checked: boolean) {
    if (checked) {
      this.selectedBudgets.push(b);
    } else {
      this.selectedBudgets = this.selectedBudgets.filter(x => x.id_presupuesto !== b.id_presupuesto);
    }
  }
  toggleSelectExpense(g: Gasto, checked: boolean) {
    if (checked) {
      this.selectedExpenses.push(g);
    } else {
      this.selectedExpenses = this.selectedExpenses.filter(x => x.id_gasto !== g.id_gasto);
    }
  }

  // Apertura del modal
  openConfirmDeleteMembers()  { this.showConfirmDeleteMembers  = true; }
  openConfirmDeleteBudgets()  { this.showConfirmDeleteBudgets  = true; }
  openConfirmDeleteExpenses() { this.showConfirmDeleteExpenses = true; }

  // Cancelar
  cancelDeleteMembers()  { this.showConfirmDeleteMembers  = false; this.selectedMembers  = []; }
  cancelDeleteBudgets()  { this.showConfirmDeleteBudgets  = false; this.selectedBudgets  = []; }
  cancelDeleteExpenses() { this.showConfirmDeleteExpenses = false; this.selectedExpenses = []; }

  // Confirmar: llamamos a los servicios y recargamos
  confirmDeleteMembers() {
    Promise.all(
      this.selectedMembers.map(u =>
        this.contactSvc.removeMemberFromGroup(this.groupId, u.id_usuario).toPromise()
      )
    ).then(() => {
      this.cancelDeleteMembers();
      this.reloadMembers();
    });
  }
  confirmDeleteBudgets() {
    // 1) construimos un array de Observables deleteCascade(...)
    const ops = this.selectedBudgets.map(b =>
      this.budgetSvc.deleteCascade(b.id_presupuesto)
    );
    // 2) los ejecutamos en paralelo
    forkJoin(ops).pipe(
      switchMap(() => this.budgetSvc.getByGroup(this.groupId)),
      tap(all => this.splitBudgets(all)),
      take(1)
    ).subscribe(() => {
      this.cancelDeleteBudgets();
      this.reloadGroup$.next();
    });
  }
  confirmDeleteExpenses() {
    Promise.all(
      this.selectedExpenses.map(g =>
        this.gastoSvc.delete(g.id_gasto).toPromise()
      )
    ).then(() => {
      this.cancelDeleteExpenses();
      this.reloadGroup$.next();
      this.gastos$ = this.gastoSvc.getByGroup(this.groupId);
    });
  }

  private reloadMembers() {
    this.pageIndex$.next(0);
    this.contactSvc.getMembersByGroup(this.groupId)
      .subscribe(list => this.membersRawSubject.next(list));
  }

  // －－－－－ Apertura del primer overlay －－－－－
  openEditBudgetOverlay() {
    if (!this.activeBudgets.length) {
      console.warn('No hay presupuestos activos para editar.');
      return;
    }
    this.budgetIndex = 0;
    this.loadBudgetIntoForm();
    this.showEditBudgetOverlay = true;
  }

  prevBudgetOverlay() {
    if (this.budgetIndex > 0) {
      this.budgetIndex--;
      this.loadBudgetIntoForm();
    }
  }
  nextBudgetOverlay() {
    if (this.budgetIndex + 1 < this.totalBudgets) {
      this.budgetIndex++;
      this.loadBudgetIntoForm();
    }
  }

  private loadBudgetIntoForm() {
    const b = this.activeBudgets[this.budgetIndex];
    this.budgetToEditOverlay = b;
    this.editBudgetForm.patchValue({
      id_presupuesto: b.id_presupuesto,
      nombre: b.nombre,
      descripcion: b.descripcion ?? '',
      cantidad: b.cantidad,
      fecha_fin: b.fecha_fin
    });
  }

  // Cuando el usuario elige un presupuesto del dropdown
  onBudgetSelected(id: number) {
    const selected = (this.budgetsSnapshot || []).find(b => b.id_presupuesto === id);
    if (!selected) return;
    this.budgetToEditOverlay = selected;
    // Rellenar el form con los valores originales
    this.editBudgetForm.patchValue({
      id_presupuesto: selected.id_presupuesto,
      nombre: selected.nombre,
      descripcion: selected.descripcion ?? '',
      cantidad: selected.cantidad,
      fecha_fin: selected.fecha_fin
    });
  }

  // Al hacer “Siguiente” en el primer overlay
  goToReviewBudget() {
    if (this.editBudgetForm.invalid) return;
    const form = this.editBudgetForm.value;
    this.reviewChanges = [];

    // Comparamos campo a campo
    const orig = this.budgetToEditOverlay!;
    if (form.nombre !== orig.nombre) {
      this.reviewChanges.push({
        field: 'Nombre',
        before: orig.nombre,
        after: form.nombre
      });
    }
    if ((form.descripcion || '') !== (orig.descripcion || '')) {
      this.reviewChanges.push({
        field: 'Descripción',
        before: orig.descripcion || '',
        after: form.descripcion
      });
    }
    if (form.cantidad !== orig.cantidad) {
      this.reviewChanges.push({
        field: 'Cantidad',
        before: orig.cantidad.toString(),
        after: form.cantidad.toString()
      });
    }
    if (new Date(form.fecha_fin).getTime() !== new Date(orig.fecha_fin).getTime()) {
      this.reviewChanges.push({
        field: 'Fecha fin',
        before: this.datePipe.transform(orig.fecha_fin, 'shortDate')!,
        after: this.datePipe.transform(form.fecha_fin, 'shortDate')!
      });
    }

    // Solo avanzamos si hay cambios
    if (this.reviewChanges.length) {
      this.showEditBudgetOverlay   = false;
      this.showReviewBudgetOverlay = true;
    } else {
    }
  }

  // Cancelar edición
  cancelEditBudget() {
    this.showEditBudgetOverlay = false;
    this.editBudgetForm.reset();
    this.budgetToEditOverlay = undefined;
  }

  // Volver al primer overlay desde revisión
  backToEditBudget() {
    this.showReviewBudgetOverlay = false;
    this.showEditBudgetOverlay   = true;
  }

  // Confirmar revisión y hacer PATCH/PUT
  confirmReviewBudget() {
    const form = this.editBudgetForm.value;
    this.budgetSvc.update(form.id_presupuesto, {
      nombre: form.nombre,
      descripcion: form.descripcion,
      cantidad: form.cantidad,
      fecha_fin: form.fecha_fin
    }).pipe(
      // Una vez termine el update, volvemos a cargar la lista
      switchMap(() => this.budgetSvc.getByGroup(this.groupId)),
      take(1)
    ).subscribe(all => {
      // repartimos activos / caducados y cerramos overlays
      this.splitBudgets(all);
      this.showReviewBudgetOverlay = false;
      this.editBudgetForm.reset();
      this.reloadGroup$.next();
    });
  }

  /* === PAGINACIÓN === */
  prevPage() { if (this.pageIndex$.value > 0) this.pageIndex$.next(this.pageIndex$.value - 1); }
  nextPage() { if (this.pageIndex$.value + 1 < this.totalPages) this.pageIndex$.next(this.pageIndex$.value + 1); }

  /* === TOGGLES DE MODO === */
  toggleAddMemberForm()    { this.showAddBudgetForm=false; this.showAddBudgetForm=false; this.showAddMemberForm = !this.showAddMemberForm; console.log(`Toggled add member form ${this.showAddMemberForm}`); }
  toggleDeleteMemberMode() { this.deleteBudgetMode=false; this.deleteExpenseMode=false; this.deleteMemberMode = !this.deleteMemberMode; }

  toggleAddBudgetForm()    { this.showAddExpenseForm=false; this.showAddMemberForm=false; this.showAddBudgetForm = !this.showAddBudgetForm; }
  toggleDeleteBudgetMode() { this.deleteExpenseMode=false; this.deleteMemberMode=false; this.deleteBudgetMode = !this.deleteBudgetMode; }
  toggleUpdateBudgetMode(b?: Budget) {
    
    this.updateBudgetMode = !this.updateBudgetMode;
    if (b) {
      this.budgetToEdit = b;
      this.updateBudgetForm.patchValue({
        id_presupuesto: b.id_presupuesto,
        nombre: b.nombre,
        cantidad: b.cantidad,
        fecha_inicio: b.fecha_inicio,
        fecha_fin: b.fecha_fin
      });
    }
  }

  /** Cancela sin guardar */
  cancelAddExpense() {
    this.showAddExpenseOverlay = false;
  }

  confirmAddExpense() {
    const form = this.addExpenseOverlayForm.value;
    const isAdmin = this.isAdmin; // ya lo tienes
    const nuevo = {
      nombre: form.nombre,
      cantidad: form.cantidad,
      descripcion: form.descripcion,
      estado: isAdmin ? 'Aceptado' : 'Pendiente',
      fecha_creacion: new Date(),
      id_grupo: this.groupId,
      id_presupuesto: form.id_presupuesto,
      id_usuario: this.authSvc.getUserId()!
    };

    this.gastoSvc.create(nuevo).pipe(
      // tras crear, recarga gastos
      switchMap(() => this.gastoSvc.getByGroup(this.groupId)),
      tap(g => this.gastos$ = this.gastoSvc.getByGroup(this.groupId)),
      take(1)
    ).subscribe(() => {
      this.showAddExpenseOverlay = false;
      this.reloadGroup$.next();
    });
  }

  /** Abre el overlay */
  toggleAddExpenseOverlay() {
    this.showAddExpenseOverlay = true;
    this.addExpenseOverlayForm.reset({
      id_presupuesto: null,
      nombre: '',
      cantidad: 0,
      descripcion: ''
    });
  }

  toggleAddExpenseForm()   { this.showAddExpenseForm   = !this.showAddExpenseForm;   }
  toggleDeleteExpenseMode(){ this.deleteExpenseMode    = !this.deleteExpenseMode;    }
  toggleUpdateExpenseMode(e?: Gasto) {
    this.updateExpenseMode = !this.updateExpenseMode;
    if (e) {
      this.expenseToEdit = e;
      this.updateExpenseForm.patchValue({ 
        id_gasto: e.id_gasto,
        descripcion: e.descripcion,
        cantidad: e.cantidad
      });
    }
  }

  /* === SUBMITS === */
  onMembersDone(selection: MembersSelection) {
    // 1) Cerramos el formulario
    this.showAddMemberForm = false;
    // 2) Para cada seleccionado, lanzamos la petición
    const ops = selection.contacts.map(u => {
      return (selection.admins.includes(u.id_usuario)
        ? this.groupSvc.addAdmin(u.id_usuario, this.groupId)
        : this.groupSvc.addMember(u.id_usuario, this.groupId)
      );
    });
    // 3) Cuando terminen todas:
    Promise.all(ops.map(o => o.toPromise())).then(() => {
      // Resetea página y recarga
      this.pageIndex$.next(0);
      this.contactSvc.getMembersByGroup(this.groupId)
        .subscribe(list => this.membersRawSubject.next(list));
    });
  }

  submitDeleteMember(member: Contact) {
    this.contactSvc.removeMemberFromGroup(this.groupId, member.id_usuario)
      .subscribe(() => {
        this.pageIndex$.next(0);
        this.contactSvc.getMembersByGroup(this.groupId)
          .subscribe(list => this.membersRawSubject.next(list));
      });
  }

  submitAddBudget() {
    const b = this.addBudgetForm.value;
    this.budgetSvc.create(this.groupId, b).pipe(
      switchMap(() => this.budgetSvc.getByGroup(this.groupId)),
      tap(all => this.splitBudgets(all)),
      take(1)
    ).subscribe(() => {
      this.toggleAddBudgetForm();
    });
  }
  submitDeleteBudget(b: Budget) {
    this.budgetSvc.deleteCascade(b.id_presupuesto).subscribe(() => {
      this.budgets$ = this.budgetSvc.getByGroup(this.groupId);
    });
  }
  submitUpdateBudget() {
    const ub = this.updateBudgetForm.value;
    this.budgetSvc.update(ub.id_presupuesto, ub).subscribe(() => {
      this.toggleUpdateBudgetMode();
      this.budgets$ = this.budgetSvc.getByGroup(this.groupId);
    });
  }

  submitAddExpense() {
    const e = this.addExpenseForm.value;
    this.gastoSvc.create({ ...e, id_grupo: this.groupId }).subscribe(() => {
      this.toggleAddExpenseForm();
      this.gastos$ = this.gastoSvc.getByGroup(this.groupId);
    });
  }
  submitDeleteExpense(e: Gasto) {
    this.gastoSvc.delete(e.id_gasto).subscribe(() => {
      this.gastos$ = this.gastoSvc.getByGroup(this.groupId);
    });
  }
  submitUpdateExpense() {
    const ue = this.updateExpenseForm.value;
    this.gastoSvc.update(ue.id_gasto, ue).subscribe(() => {
      this.toggleUpdateExpenseMode();
      this.gastos$ = this.gastoSvc.getByGroup(this.groupId);
    });
  }

  getBudgetNameById(id: number): string {
    const b = this.budgetsSnapshot.find(x => x.id_presupuesto === id);
    return b ? b.nombre : 'Presupuesto no encontrado';
  }

  // devuelve un Observable<string> y en el template lo consumirás con | async
  getUserNameById(id: number): Observable<string> {
    return this.authSvc.getUserById(id).pipe(
      map(u => u ? `${u.nombre} ${u.apellidos}` : 'Usuario no encontrado')
    );
  }

  private loadGroup() {
    this.group$ = this.groupSvc.buscarGrupoPorId(this.groupId);
  }

  goToProfile(u: Usuario) {
    this.router.navigate(['/perfil', u.id_usuario]);
  }

  goBack()   { window.history.back(); }
}
