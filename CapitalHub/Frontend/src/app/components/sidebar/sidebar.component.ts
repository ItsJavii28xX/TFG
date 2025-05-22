import { Component, Input } from '@angular/core';
import { RouterModule }     from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
    trigger('openClose', [
      state('open', style({
        width: '240px',
        opacity: 1,
        borderRight: '2px solid #0e0e0e'
      })),
      state('closed', style({
        width: '0px',
        opacity: 0,
        borderRight: 'none'
      })),
      transition('open <=> closed', animate('200ms ease-in-out'))
    ])
  ]
})
export class SidebarComponent {
  @Input() status: 'open' | 'closed' = 'closed';
}

