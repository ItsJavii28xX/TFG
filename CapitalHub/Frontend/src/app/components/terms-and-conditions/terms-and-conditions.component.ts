import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terms-and-conditions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.css']
})

export class TermsAndConditionsComponent {
  
  lastUpdated = '15 de junio de 2025';
  
  constructor(private router: Router) {}
  
  goHome() {
    this.router.navigate(['/home']);
  }

}
