import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../auth/auth.service';
import { ProfileComponent } from '../profile/profile.component';
import { DemandeComponent } from '../demande/demande.component';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProfileService, UserProfile } from '../profile/profile.service';
import { ProfileImageService } from '../shared/profile-image.service';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    ProfileComponent,
    DemandeComponent,
    AsyncPipe
  ],
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.scss']
})
export class DoctorDashboardComponent implements OnInit {
  userName$: Observable<string>;
  userProfile?: UserProfile;
  isMenuOpen = false; // Controls sidebar visibility on mobile
  isProfileDropdownOpen = false; // Controls profile dropdown visibility
  activeSection = 'dashboard'; // Tracks the active section

  // Dynamic doctor information
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
    private router: Router,
    private profileService: ProfileService,
    private profileImageService: ProfileImageService
  ) {
    this.userName$ = this.authService.currentUser$.pipe(
      map(user => user?.name || 'Doctor')
    );
    this.updateTimeOfDay();
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    this.profileService.getCurrentProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        console.log('Loaded user profile:', profile);
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
      }
    });
  }

  getProfileImageUrl(): string {
    return this.profileImageService.getProfileImageUrl(this.userProfile?.profilePicturePath);
  }

  private updateTimeOfDay(): void {
    const hour = new Date().getHours();
    if (hour < 12) {
      this.timeOfDay = 'Morning';
    } else if (hour < 17) {
      this.timeOfDay = 'Afternoon';
    } else {
      this.timeOfDay = 'Evening';
    }
  }

  // Toggle sidebar on mobile
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Toggle profile dropdown
  toggleProfileDropdown(): void {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  // Navigate to Dashboard
  showDashboard(): void {
    this.activeSection = 'dashboard';
    this.isProfileDropdownOpen = false;
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
  showSettings(): void {
    this.activeSection = 'settings';
    this.isProfileDropdownOpen = false;
  }

  // Navigate to Profile
  showProfile(): void {
    this.activeSection = 'profile';
    this.isProfileDropdownOpen = false;
  }
  showDemande() {
    this.activeSection = 'demande';
  }

  // Logout the user
  logout(): void {
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
