// src/app/components/content/content.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { Subscription }  from 'rxjs';
import { AuthService }   from '../../services/auth.service';
import { GroupService, Group } from '../../services/group.service';
import { GroupComponent } from '../group/group.component';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule, GroupComponent],
  templateUrl: './content.component.html'
})
export class ContentComponent implements OnInit, OnDestroy {
  groups: Group[] = [];
  private subs = new Subscription();
  private userId!: number;

  constructor(
    private groupSvc: GroupService,
    private authSvc:  AuthService
  ) {}

  ngOnInit() {
    // 1) obtenemos el userId
    this.userId = this.authSvc.getUserId()!;
    // 2) carga inicial
    this.loadGroups();
    // 3) recarga cuando se emita
    this.subs.add(
      this.groupSvc.refresh$.subscribe(() => this.loadGroups())
    );
  }

  private loadGroups() {
    this.groupSvc.getAll(this.userId)
      .subscribe(gs => this.groups = gs);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
