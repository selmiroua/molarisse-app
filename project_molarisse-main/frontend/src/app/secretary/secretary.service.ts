import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Doctor } from '../models/doctor.model';
import { tap, map } from 'rxjs/operators';

export interface SecretaryRequest {
  doctorId: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: string;
  adresse: string;
  hasExperience: boolean;
  anneeExperience?: number;
  dernierEmployeur?: string;
  motivation: string;
}

@Injectable({
  providedIn: 'root'
})
export class SecretaryService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  private getMultipartHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAcceptedDoctors(): Observable<Doctor[]> {
    const url = `${this.apiUrl}/api/v1/api/users/doctors/accepted`;
    console.log('Fetching accepted doctors from:', url);
    return this.http.get<Doctor[]>(url, {
      headers: this.getHeaders(),
      withCredentials: true
    });
  }

  getProfilePicture(profilePicturePath: string): Observable<Blob> {
    const url = `${this.apiUrl}/api/v1/api/users/profile/picture/${profilePicturePath}`;
    console.log('Requesting profile picture from:', url);
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      'Accept': 'image/jpeg,image/png,image/gif,image/*'
    });

    return this.http.get(url, {
      headers: headers,
      responseType: 'blob',
      withCredentials: true,
      observe: 'response'
    }).pipe(
      tap({
        next: (response) => {
          console.log('Profile picture response headers:', response.headers);
          console.log('Profile picture response status:', response.status);
          console.log('Profile picture content type:', response.headers.get('Content-Type'));
          console.log('Profile picture size:', response.body?.size);
        },
        error: (error) => {
          console.error('Error fetching profile picture:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
        }
      }),
      map(response => response.body as Blob)
    );
  }

  sendDoctorRequest(data: FormData | SecretaryRequest): Observable<any> {
    const url = `${this.apiUrl}/api/v1/secretary/requests`;
    console.log('Sending secretary request');
    
    if (data instanceof FormData) {
      return this.http.post(url, data, {
        headers: this.getMultipartHeaders(),
        withCredentials: true
      });
    } else {
      return this.http.post(url, data, {
        headers: this.getHeaders(),
        withCredentials: true
      });
    }
  }
} 