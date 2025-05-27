// src/app/components/group-form/group-form.component.ts
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators }      from '@angular/forms';
import { GroupService }    from '../../services/group.service';
import { BudgetService, BudgetDto, Budget } from '../../services/budget.service';
import { AuthService }     from '../../services/auth.service';
import { Contact, MembersSelectComponent, MembersSelection } from '../members-select/members-select.component';
import { BudgetFormComponent }    from '../budget-form/budget-form.component';
import { MatChip } from '@angular/material/chips';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatLabel } from '@angular/material/form-field';
import { MatChipSet } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-group-form',
  standalone: true,
  imports: [
    MembersSelectComponent,
    BudgetFormComponent,
    CommonModule,
    ReactiveFormsModule,
    MatChip,
    MatButton,
    MatCard,
    MatFormField,
    MatInput,
    MatProgressBarModule,
    MatLabel,
    MatCheckboxModule,
    MatChipSet
  ],
  templateUrl: './group-form.component.html',
  styleUrls:  ['./group-form.component.css']
})
export class GroupFormComponent implements OnInit {
  @Output() cancel  = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  f!: FormGroup;
  addingMembers   = false;
  addingBudget    = false;
  selectedMembers: Contact[]     = [];
  membersAsAdmin:   boolean      = false;
  budgetData: BudgetDto | null = null;

  constructor(
    private fb:       FormBuilder,
    private groupSvc: GroupService,
    private budgetSvc:BudgetService,
    private authSvc:  AuthService
  ) {}

  ngOnInit() {
    this.f = this.fb.group({
      nombre: ['', Validators.required]
    });
  }

  openMembers() { this.addingMembers = true; }
  openBudget()  { this.addingBudget  = true; }

  onMembersDone(selection: MembersSelection) {
    this.selectedMembers = selection.contacts;
    this.membersAsAdmin  = selection.asAdmin;
    this.addingMembers   = false;
  }

  onBudgetDone(data: BudgetDto) {
    this.budgetData   = data;
    this.addingBudget = false;
  }

 onSubmit() {
    if (this.f.invalid) return;
    const name    = this.f.value.nombre!;
    const founder = this.authSvc.getUserId()!;

    this.groupSvc.create(name).subscribe(grp => {
      const gid = grp.id_grupo;

      // 1) fundador (siempre devolvemos un Observable)
      const creatorOp = this.membersAsAdmin
        ? this.groupSvc.addAdmin(founder, gid)
        : this.groupSvc.addMember(founder, gid);

      creatorOp.subscribe(() => {
        // 2) resto de miembros
        const ops = this.selectedMembers.map(u =>
          this.membersAsAdmin
            ? this.groupSvc.addAdmin(u.id_usuario, gid)
            : this.groupSvc.addMember(u.id_usuario, gid)
        );

        // 3) esperamos a que terminen todas las inserciones
        Promise.all(ops.map(o => o.toPromise()))
          .then((): Promise<Budget | undefined> => {
            // 4) creamos presupuesto si lo hay
            if (this.budgetData) {
              return this.budgetSvc
                .create(gid, this.budgetData)
                .toPromise();
            }
            // **muy importante** indicar explícitamente el tipo
            return Promise.resolve<Budget | undefined>(undefined);
          })
          .then(() => {
            // 5) todo OK, refrescamos y notificamos
            this.groupSvc.triggerRefresh();
            this.created.emit();
          })
          .catch(err => {
            console.error('Error en la creación en cadena:', err);
            this.created.emit();
          });
      });
    });
  }


  onCancel() {
    this.cancel.emit();
  }
}
