import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileImageService {
  getProfileImageUrl(profilePicturePath?: string, timestamp?: number): string {
    if (profilePicturePath) {
      try {
        const t = timestamp || new Date().getTime();
        return `${environment.apiUrl}/api/v1/api/users/profile/picture/${profilePicturePath}?t=${t}`;
      } catch (error) {
        console.error('Error generating profile picture URL:', error);
        return this.getDefaultImageForRole();
      }
    }
    return this.getDefaultImageForRole();
  }

  private getDefaultImageForRole(): string {
    // You can customize this based on the user's role
    return 'assets/images/default-avatar.png';
  }
}
