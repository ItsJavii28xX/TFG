import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Grupo, GroupService } from '../../services/group.service';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-group-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './group-details.component.html',
  styleUrl: './group-details.component.css'
})
export class GroupDetailsComponent implements OnInit {
  groupId!: number;
  group$!: Observable<Grupo>;

  constructor(
    private route: ActivatedRoute,
    private groupSvc: GroupService
  ) {}

  ngOnInit() {
    this.groupId = Number(this.route.snapshot.paramMap.get('id'));
    this.group$ = this.groupSvc.buscarGrupoPorId(this.groupId);
  }

  editName() {
    // Ejemplo de acción de edición
    alert('Aquí iría la lógica para editar el nombre del grupo');
  }

  goBack() {
    window.history.back();
  }
}
