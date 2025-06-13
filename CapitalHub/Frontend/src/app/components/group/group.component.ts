// src/app/components/group/group.component.ts
import { Component, EventEmitter, Input, OnInit, Output }     from '@angular/core';
import { CommonModule }                 from '@angular/common';
import { MatCardModule }                from '@angular/material/card';
import { MatProgressBarModule }         from '@angular/material/progress-bar';
import { MatIconModule }                from '@angular/material/icon';
import { MatTooltipModule }             from '@angular/material/tooltip';

import { forkJoin }                     from 'rxjs';
import { switchMap, map }               from 'rxjs/operators';

import { Group }                        from '../../services/group.service';
import { BudgetService, Budget }        from '../../services/budget.service';
import { ContactService, Contact }      from '../../services/contact.service';
import { GastoService, Gasto } from '../../services/gasto.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressBarModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    MatTooltipModule,
    RouterModule
  ],
  templateUrl: './group.component.html',
  styleUrls:   ['./group.component.css']
})
export class GroupComponent implements OnInit {
  @Input() group!: Group;
  @Input() isEditing = false;
  @Input() editName  = '';
  @Output() editNameChange = new EventEmitter<string>();
  @Input() updateMode = false;
  
  

  activeBudgets: { nombre: string; approvedPct: number, pendingPct: number }[] = [];
  members:       Contact[] = [];
  mostrarGrupo = false;

  

  get membersToShow() {
    return this.members.slice(0, 5);
  }
  get extraCount() {
    return Math.max(0, this.members.length - 5);
  }

  constructor(
    private budgetSvc : BudgetService,
    private gastoSvc  : GastoService,
    private contactSvc: ContactService,
    private router: Router
  ) {}

  ngOnInit() {
    const today = new Date();

    forkJoin({
      budgets:  this.budgetSvc.getByGroup(this.group.id_grupo),
      expenses: this.gastoSvc.getByGroup(this.group.id_grupo)
    }).subscribe(({ budgets, expenses }) => {
      this.activeBudgets = budgets
        .filter(b => new Date(b.fecha_fin) > today)
        .map(b => {
          // filtra gastos de este presupuesto y periodo
          const byBudget = expenses
            .filter(e => e.id_presupuesto === b.id_presupuesto)
            .filter(e => {
              const d = new Date(e.fecha_creacion);
              return d >= new Date(b.fecha_inicio) && d <= new Date(b.fecha_fin);
            });

          const approvedSum = byBudget
            .filter(e => e.estado === 'aceptado')
            .reduce((sum, e) => sum + +e.cantidad, 0);

          const pendingSum = byBudget
            .filter(e => e.estado === 'pendiente')
            .reduce((sum, e) => sum + +e.cantidad, 0);

          // evita dividir entre cero
          const approvedPct = b.cantidad ? (approvedSum / +b.cantidad) * 100 : 0;
          const pendingPct  = b.cantidad ? (pendingSum  / +b.cantidad) * 100 : 0;

          return {
            nombre: b.nombre,
            approvedPct: Math.min(100, approvedPct),
            pendingPct:  Math.min(100, pendingPct)
          };
        });
    });

    this.contactSvc.getMembersByGroup(this.group.id_grupo)
      .subscribe(ms => this.members = ms);
  }

  
  onGroupClick(groupId: number) {
    this.mostrarGrupo = !this.mostrarGrupo;
    this.router.navigate(['/app-group-details', groupId]);
  }
}
