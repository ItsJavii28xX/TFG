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
  
  

  activeBudget: { nombre: string; porcentaje: number } | null = null;
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
      const activos = budgets
        .filter(b => new Date(b.fecha_fin) > today)
        .map(b => {
          const spent = expenses
            .filter(e => {
              const d = new Date(e.fecha_creacion);
              return d >= new Date(b.fecha_inicio) && d <= new Date(b.fecha_fin);
            })
            .reduce((sum, e) => sum + e.cantidad, 0);
          const pct = Math.min(100, (spent / b.cantidad) * 100);
          return { nombre: b.nombre, porcentaje: pct };
        });
      this.activeBudget = activos.length > 0 ? activos[0] : null;
    });

  this.contactSvc.getMembersByGroup(this.group.id_grupo)
    .subscribe(ms => this.members = ms);
  }

  
  onGroupClick(groupId: number) {
    this.mostrarGrupo = !this.mostrarGrupo;
    this.router.navigate(['/app-group-details', groupId]);
  }
}
