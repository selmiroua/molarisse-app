import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/v1/auth`;
  private userRole: string | null = null;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Only access localStorage in browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.userRole = localStorage.getItem('userRole');
      console.log('[AuthService] Initialized with role:', this.userRole);
      console.log('[AuthService] Current token:', localStorage.getItem('access_token'));
    }
  }

  register(userData: any): Observable<any> {
    console.log('Registering user with data:', userData);
    return this.http.post(`${this.apiUrl}/register`, userData)
      .pipe(
        tap(response => console.log('Registration response:', response)),
        catchError(error => {
          console.error('Registration error:', error);
          throw error;
        })
      );
  }

  authenticate(credentials: any): Observable<any> {
    console.log('[AuthService] Authenticating with credentials:', credentials);
    return this.http.post(`${this.apiUrl}/authenticate`, credentials).pipe(
      tap((response: any) => {
        console.log('[AuthService] Auth response:', response);
        if (response?.token) {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('access_token', response.token);
            console.log('[AuthService] Stored token:', response.token);
          }
        }
        if (response?.role) {
          const lowerCaseRole = response.role.toLowerCase();
          console.log('[AuthService] Setting role:', lowerCaseRole);
          this.userRole = lowerCaseRole;
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('userRole', lowerCaseRole);
            console.log('[AuthService] Stored role in localStorage:', localStorage.getItem('userRole'));
          }
        } else {
          console.error('[AuthService] No role in response');
          throw new Error('No role received from server');
        }
      }),
      catchError(error => {
        console.error('[AuthService] Authentication error:', error);
        throw error;
      })
    );
  }

  logout(): void {
    this.userRole = null;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('userRole');
      localStorage.removeItem('access_token');
    }
  }

  getUserRole(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const storedRole = localStorage.getItem('userRole');
      console.log('[AuthService] Getting user role from storage:', storedRole);
      const role = this.userRole || storedRole;
      return role ? role.toLowerCase() : null;
    } else {
      console.log('[AuthService] Getting user role from memory:', this.userRole);
      return this.userRole ? this.userRole.toLowerCase() : null;
    }
  }

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const hasToken = !!localStorage.getItem('access_token');
      console.log('[AuthService] Is authenticated:', hasToken);
      return hasToken;
    }
    return false;
  }

  activateAccount(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/activate-account`, { params: { token } })
      .pipe(
        tap(response => console.log('Account activation response:', response)),
        catchError(error => {
          console.error('Account activation error:', error);
          throw error;
        })
      );
  }

  getRoles(): Observable<string[]> {
    console.log('Getting roles from:', `${this.apiUrl}/roles`);
    return this.http.get<string[]>(`${this.apiUrl}/roles`)
      .pipe(
        tap(roles => console.log('Received roles:', roles)),
        catchError(error => {
          console.error('Error getting roles:', error);
          throw error;
        })
      );
  }
}
