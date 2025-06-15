import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})

export class PrivacyPolicyComponent {
  lastUpdated = '15 de junio de 2025';

  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/home']);
  }

}
