import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-group-options',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './group-options.component.html',
  styleUrl: './group-options.component.css'
})

export class GroupOptionsComponent {
  @Input()  open = false;
  @Output() close  = new EventEmitter<void>();
  @Output() add    = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() update = new EventEmitter<void>();
}
