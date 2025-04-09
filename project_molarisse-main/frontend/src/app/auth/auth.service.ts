import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

interface UserData {
  name: string;
  role: string;
  email: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/v1/auth`;
  private currentUserSubject = new BehaviorSubject<UserData | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadInitialUser();
  }

  private loadInitialUser(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userData = localStorage.getItem('userData');
      const token = localStorage.getItem('access_token');

      if (userData && token) {
        try {
          const parsedData = JSON.parse(userData);
          this.currentUserSubject.next({
            ...parsedData,
            token: token
          });
        } catch (e) {
          console.error('Failed to parse user data', e);
          this.clearStorage();
        }
      }
    }
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap(response => console.log('Registration response:', response)),
      catchError(error => {
        console.error('Registration error:', error);
        throw error;
      })
    );
  }

  authenticate(credentials: { email: string, password: string }): Observable<UserData> {
    return this.http.post<{
      token: string,
      fullName: string,
      role: string,
      email: string
    }>(`${this.apiUrl}/authenticate`, credentials).pipe(
      map(response => {
        if (!response.token || !response.fullName) {
          throw new Error('Invalid authentication response');
        }

        return {
          name: response.fullName,
          role: response.role.toLowerCase(),
          email: response.email,
          token: response.token
        };
      }),
      tap(userData => {
        this.storeUserData(userData);
        this.currentUserSubject.next(userData);
      }),
      catchError(error => {
        console.error('Authentication error:', error);
        throw error;
      })
    );
  }

  private storeUserData(userData: UserData): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('access_token', userData.token || '');
      localStorage.setItem('userData', JSON.stringify({
        name: userData.name,
        role: userData.role,
        email: userData.email
      }));
      localStorage.setItem('userRole', userData.role);
    }
  }

  getCurrentUser(): UserData | null {
    return this.currentUserSubject.value;
  }

  getUserName(): string {
    return this.currentUserSubject.value?.name || 'Secrétaire';
  }

  getUserRole(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('userRole');
    }
    return this.currentUserSubject.value?.role || null;
  }

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('access_token');
    }
    return false;
  }

  logout(): void {
    this.clearStorage();
    this.currentUserSubject.next(null);
  }

  private clearStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('userData');
      localStorage.removeItem('userRole');
    }
  }

  activateAccount(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/activate-account`, { params: { token } }).pipe(
      tap(response => console.log('Account activation response:', response)),
      catchError(error => {
        console.error('Account activation error:', error);
        throw error;
      })
    );
  }

  getRoles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/roles`).pipe(
      tap(roles => console.log('Received roles:', roles)),
      catchError(error => {
        console.error('Error getting roles:', error);
        throw error;
      })
    );
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch (e) {
      console.error('Error parsing JWT', e);
      return null;
    }
  }
}
