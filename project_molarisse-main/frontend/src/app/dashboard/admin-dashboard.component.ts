import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../auth/auth.service';
import { ProfileComponent } from '../profile/profile.component';
import { HttpClient } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProfileService, UserProfile } from '../profile/profile.service';
import { ProfileImageService } from '../shared/profile-image.service';

interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    ProfileComponent,
    AsyncPipe
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
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

  notifications: Notification[] = [];
  unreadCount: number = 0;
  showNotifications: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private profileService: ProfileService,
    private profileImageService: ProfileImageService
  ) {
    this.userName$ = this.authService.currentUser$.pipe(
      map(user => user?.name || 'Admin')
    );
    this.updateTimeOfDay();
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadNotifications();
    // Refresh notifications every minute
    setInterval(() => {
      this.loadNotifications();
    }, 60000);
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

  showDemandeManagement() {
    this.router.navigate(['/dashboard/demande-management']);
  }

  // Logout the user
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  loadNotifications() {
    console.log('Loading notifications...');
    this.http.get<Notification[]>('http://localhost:8080/api/v1/notifications/user').subscribe(
      (data) => {
        console.log('Received notifications:', data);
        this.notifications = data;
        this.unreadCount = data.filter(n => !n.isRead).length;
        console.log('Unread count:', this.unreadCount);
      },
      (error) => {
        console.error('Error loading notifications:', error);
      }
    );
  }

  toggleNotifications() {
    console.log('Toggling notifications, current state:', this.showNotifications);
    this.showNotifications = !this.showNotifications;
    console.log('New state:', this.showNotifications);
    if (this.showNotifications) {
      this.loadNotifications();
    }
  }

  markAsRead(notification: Notification) {
    this.http.put(`http://localhost:8080/api/v1/notifications/${notification.id}/read`, {}).subscribe(
      () => {
        notification.isRead = true;
        this.unreadCount = this.notifications.filter(n => !n.isRead).length;
      },
      (error) => {
        console.error('Error marking notification as read:', error);
      }
    );
  }

  markAllAsRead() {
    this.http.put('http://localhost:8080/api/v1/notifications/mark-all-read', {}).subscribe(
      () => {
        this.notifications.forEach(n => n.isRead = true);
        this.unreadCount = 0;
      },
      (error) => {
        console.error('Error marking all notifications as read:', error);
      }
    );
  }
}
