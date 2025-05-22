import { Component }      from '@angular/core';
import { RouterModule }   from '@angular/router';
import { CommonModule }   from '@angular/common';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent {}
