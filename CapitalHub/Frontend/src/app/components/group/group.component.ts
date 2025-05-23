import { Component, Input } from '@angular/core';
import { MatCardModule }    from '@angular/material/card';
import { CommonModule }     from '@angular/common';
import { Group }            from '../../services/group.service';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})

export class GroupComponent {
  @Input() group!: Group;
}
