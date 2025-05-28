import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Subscription }  from 'rxjs';
import { AuthService }   from '../../services/auth.service';
import { GroupService, Group } from '../../services/group.service';
import { GroupComponent } from '../group/group.component';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule, GroupComponent, FormsModule, MatIcon],
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit, OnDestroy {
  groups: Group[] = [];

  @Input() deleteMode = false;
  @Input() selectedIds = new Set<number>();
  @Output() selectionChange = new EventEmitter<Set<number>>();
  @Input() updateMode = false;

  private subs = new Subscription();
  private userId!: number;

  editingId: number|null = null;
  editingName = '';

  constructor(
    private groupSvc: GroupService,
    private authSvc:  AuthService
  ) {}

  ngOnInit() {
    this.userId = this.authSvc.getUserId()!;
    this.loadGroups();
    this.subs.add(
      this.groupSvc.refresh$.subscribe(() => this.loadGroups())
    );
  }

  private loadGroups() {
    this.groupSvc.getAll(this.userId)
      .subscribe(gs => this.groups = gs);
  }

  onCheckboxChange(groupId: number, checked: boolean) {
    if (checked) this.selectedIds.add(groupId);
    else this.selectedIds.delete(groupId);
    this.selectionChange.emit(this.selectedIds);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  openUpdateForm() {
    this.updateMode = true;
  }

  cancelUpdate() {
    this.updateMode = false;
    this.editingId = null;
  }

  startEdit(g: Group) {
    this.editingId   = g.id_grupo;
    this.editingName = g.nombre;
  }

  saveEdit(g: Group) {
    this.groupSvc.update(g.id_grupo, { nombre: this.editingName })
      .subscribe(() => {
        this.groupSvc.triggerRefresh();
        this.cancelEdit();
      });
  }

  cancelEdit() {
    this.editingId = null;
  }

}
