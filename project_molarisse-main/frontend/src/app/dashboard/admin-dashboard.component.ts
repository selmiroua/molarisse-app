import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../auth/auth.service';
import { ProfileComponent } from '../profile/profile.component';
import { HttpClient } from '@angular/common/http';

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
    ProfileComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
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

  notifications: Notification[] = [];
  unreadCount: number = 0;
  showNotifications: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.setTimeOfDay();
    this.loadDoctorInfo();
    this.loadNotifications();
    // Refresh notifications every minute
    setInterval(() => {
      this.loadNotifications();
    }, 60000);
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

  // Navigate to Settings
  showSettings() {
    this.activeSection = 'settings';
  }

  // Navigate to Profile
  showProfile() {
    this.activeSection = 'profile';
    this.isProfileDropdownOpen = false;
  }

  showDemandeManagement() {
    this.router.navigate(['/dashboard/demande-management']);
  }

  // Logout the user
  logout() {
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
