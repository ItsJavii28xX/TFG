import { Component, OnInit }  from '@angular/core';
import { ActivatedRoute, Router }     from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Grupo, GroupService }     from '../../services/group.service';
import { Contact, ContactService, Usuario } from '../../services/contact.service';
import { BudgetService, Budget }   from '../../services/budget.service';
import { GastoService, Gasto }     from '../../services/gasto.service';

import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { MatList, MatListModule } from '@angular/material/list';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';
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
    MembersSelectComponent
  ],
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.css']
})
export class GroupDetailsComponent implements OnInit {
  groupId!: number;
  group$!: Observable<Grupo>;

  // PAGINACIÓN miembros
  private membersRaw$!: Observable<Contact[]>;
  pageIndex$ = new BehaviorSubject<number>(0);
  readonly pageSize = 3;
  totalPages = 1;
  members$!: Observable<Contact[]>;

  // STREAMS
  budgets$!: Observable<Budget[]>;
  gastos$!: Observable<Gasto[]>;

  // FORMS inline
  addMemberForm!: FormGroup;
  addBudgetForm!: FormGroup;
  addExpenseForm!: FormGroup;
  updateBudgetForm!: FormGroup;
  updateExpenseForm!: FormGroup;

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

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private groupSvc: GroupService,
    private contactSvc: ContactService,
    private budgetSvc: BudgetService,
    private gastoSvc: GastoService,
    private authSvc: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.groupId = Number(this.route.snapshot.paramMap.get('id_grupo'));

    // 1) datos básicos
    this.group$ = this.groupSvc.buscarGrupoPorId(this.groupId);

    // 2) miembros + paginación
    this.membersRaw$ = this.contactSvc.getMembersByGroup(this.groupId);
    this.members$ = combineLatest([this.membersRaw$, this.pageIndex$]).pipe(
      map(([all, idx]) => {
        this.totalPages = Math.max(Math.ceil(all.length / this.pageSize), 1);
        const page = Math.min(Math.max(idx, 0), this.totalPages - 1);
        if (page !== idx) this.pageIndex$.next(page);
        return all.slice(page * this.pageSize, page * this.pageSize + this.pageSize);
      })
    );
    this.allContacts$ = this.contactSvc.getAllContacts(this.authSvc.getCurrentUser().id_usuario);

    // 3) presupuestos y gastos
    this.budgets$ = this.budgetSvc.getByGroup(this.groupId);
    this.gastos$  = this.gastoSvc.getByGroup(this.groupId);

    // 4) formularios
    this.addMemberForm    = this.fb.group({ id_usuario_contacto: [null] });
    this.addBudgetForm    = this.fb.group({ nombre: [''], cantidad: [0], fecha_inicio: [null], fecha_fin: [null] });
    this.updateBudgetForm = this.fb.group({ id_presupuesto: [null], nombre: [''], cantidad: [0], fecha_inicio: [null], fecha_fin: [null] });
    this.addExpenseForm   = this.fb.group({ descripcion: [''], cantidad: [0] });
    this.updateExpenseForm= this.fb.group({ id_gasto: [null], descripcion: [''], cantidad: [0] });
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
    // 1️⃣ Salimos del modo “añadir”
    this.showAddMemberForm = false;

    // 2️⃣ Para cada usuario seleccionado, añadimos como admin o miembro
    selection.contacts.forEach(u => {
      const op$ = selection.admins.includes(u.id_usuario)
        ? this.groupSvc.addAdmin(u.id_usuario, this.groupId)
        : this.groupSvc.addMember(u.id_usuario, this.groupId);
      op$.subscribe(() => {
        // refrescamos listados cuando todas las peticiones respondan
        this.membersRaw$ = this.contactSvc.getMembersByGroup(this.groupId);
      });
    });
  }

  submitDeleteMember(member: Contact) {
    this.contactSvc.removeMemberFromGroup(this.groupId, member.id_usuario).subscribe(() => {
      this.membersRaw$ = this.contactSvc.getMembersByGroup(this.groupId);
    });
  }

  submitAddBudget() {
    const b = this.addBudgetForm.value;
    this.budgetSvc.create(this.groupId, { ...b }).subscribe(() => {
      this.toggleAddBudgetForm();
      this.budgets$ = this.budgetSvc.getByGroup(this.groupId);
    });
  }
  submitDeleteBudget(b: Budget) {
    this.budgetSvc.delete(b.id_presupuesto).subscribe(() => {
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

  goToProfile(u: Usuario) {
    this.router.navigate(['/perfil', u.id_usuario]);
  }

  goBack()   { window.history.back(); }
}
