import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { GroupService, Group } from '../../services/group.service';
import { GroupComponent }    from '../group/group.component';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule, GroupComponent],
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})

export class ContentComponent implements OnInit {
  groups: Group[] = [];

  constructor(private groupSvc: GroupService) {}

  ngOnInit() {
    this.groupSvc.getAll().subscribe(gs => this.groups = gs);
  }
}
