import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ProfileComponent } from '../profile/profile.component';
import { Router, RouterModule } from '@angular/router';
import { ProfileService, UserProfile } from '../profile/profile.service';
import { ProfileImageService } from '../shared/profile-image.service';
import { DemandeComponent } from '../demande/demande.component';

@Component({
  selector: 'app-secretaire-dashboard',
  standalone: true,
  imports: [
    AsyncPipe,
    CommonModule,
    RouterModule,
    ProfileComponent,
    DemandeComponent
  ],
  templateUrl: './secretaire-dashboard.component.html',
  styleUrls: ['./secretaire-dashboard.component.scss']
})
export class SecretaireDashboardComponent implements OnInit {
  userName$: Observable<string>;
  userProfile?: UserProfile;
  isMenuOpen = false;
  isProfileDropdownOpen = false;
  activeSection = 'dashboard';
  showDemands = false;
  private _imageTimestamp: number | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private profileService: ProfileService,
    private profileImageService: ProfileImageService
  ) {
    this.userName$ = this.authService.currentUser$.pipe(
      map(user => user?.name || 'Secrétaire')
    );
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
    if (!this.userProfile?.profilePicturePath) {
      return 'assets/images/default-profile.png';
    }
    if (!this._imageTimestamp) {
      this._imageTimestamp = Date.now();
    }
    return this.profileImageService.getProfileImageUrl(this.userProfile.profilePicturePath, this._imageTimestamp);
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleProfileDropdown(): void {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  showDashboard(): void {
    this.activeSection = 'dashboard';
    this.showDemands = false;
    this.isProfileDropdownOpen = false;
  }

  showProfile(): void {
    this.activeSection = 'profile';
    this.showDemands = false;
    this.isProfileDropdownOpen = false;
  }

  showDemande(): void {
    this.activeSection = 'demande';
    this.showDemands = false;
    this.isProfileDropdownOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
