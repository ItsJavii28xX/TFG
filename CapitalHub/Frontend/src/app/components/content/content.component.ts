import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Subscription }  from 'rxjs';
import { AuthService }   from '../../services/auth.service';
import { GroupService, Group } from '../../services/group.service';
import { GroupComponent } from '../group/group.component';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule, GroupComponent],
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit, OnDestroy {
  groups: Group[] = [];

  @Input() deleteMode = false;
  @Input() selectedIds = new Set<number>();
  @Output() selectionChange = new EventEmitter<Set<number>>();

  private subs = new Subscription();
  private userId!: number;

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
}
