import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../auth/auth.service';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    ProfileComponent,

  ],
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.scss']
})
export class PatientDashboardComponent {
  isMenuOpen = false;
  activeSection = 'doctors'; // Default to doctors view

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  showDashboard() {
    this.activeSection = 'dashboard';
  }

  showDoctors() {
    this.activeSection = 'doctors';
  }

  showProfile() {
    this.activeSection = 'profile';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
