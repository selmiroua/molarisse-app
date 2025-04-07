import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../auth/auth.service';
import { ProfileComponent } from '../profile/profile.component';
import { DemandeComponent } from '../demande/demande.component';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    ProfileComponent,
    DemandeComponent
  ],
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.scss']
})
export class DoctorDashboardComponent implements OnInit {
  isMenuOpen = false; // Controls sidebar visibility on mobile
  isProfileDropdownOpen = false; // Controls profile dropdown visibility
  activeSection = 'dashboard'; // Tracks the active section

  // Dynamic doctor information
  doctorName = 'Dr. Aroua Youssef'; // Will be set dynamically from user login
  timeOfDay = 'Morning'; // Will be updated based on current time

  // Statistics
  appointmentsCount = 86;
  surgeriesCount = 23;
  patientsIncrease = 96;

  // Calendar data
  currentMonth = 'April 2020';

  // Requests data
  requests = [
    { name: 'John Doe', email: 'john@example.com', status: 'en cours' },

  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.setTimeOfDay();
    this.loadDoctorInfo();
  }

  // Set time of day greeting based on current time
  setTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 12) {
      this.timeOfDay = 'Morning';
    } else if (hour < 17) {
      this.timeOfDay = 'Afternoon';
    } else {
      this.timeOfDay = 'Evening';
    }
  }

  // Load doctor information from auth service
  loadDoctorInfo() {
    // In a real application, this would come from the authentication service
    // For now, we'll use the default value
    // this.authService.getCurrentUser().subscribe(user => {
    //   if (user) {
    //     this.doctorName = user.name;
    //   }
    // });
  }

  // Toggle sidebar on mobile
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Toggle profile dropdown
  toggleProfileDropdown() {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  // Navigate to Dashboard
  showDashboard() {
    this.activeSection = 'dashboard';
  }

  // Navigate to Patients
  showPatients() {
    this.activeSection = 'patients';
  }

  // Navigate to Appointments
  showAppointments() {
    this.activeSection = 'appointments';
  }

  // Navigate to Treatments (new for dental)
  showTreatments() {
    this.activeSection = 'treatments';
  }

  // Navigate to Pharmacy
  showPharmacy() {
    this.activeSection = 'pharmacy';
  }

  // Navigate to History
  showHistory() {
    this.activeSection = 'history';
  }

  // Navigate to Help Centre
  showHelpCentre() {
    this.activeSection = 'helpCentre';
  }

  // Navigate to Requests
  showRequests() {
    this.activeSection = 'requests';
  }

  // Navigate to Settings
  showSettings() {
    this.activeSection = 'settings';
  }

  // Navigate to Profile
  showProfile() {
    this.activeSection = 'profile';
    this.isProfileDropdownOpen = false;
  }
  showDemande() {
    this.activeSection = 'demande';
  }

  // Logout the user
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Accept a request
  acceptRequest(request: any) {
    request.status = 'accepté';
  }

  // Reject a request
  rejectRequest(request: any) {
    request.status = 'refusé';
  }
}
