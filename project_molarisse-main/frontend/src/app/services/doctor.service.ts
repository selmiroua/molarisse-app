import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Doctor } from '../models/doctor.model';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllDoctors(): Observable<Doctor[]> {
    const url = `${this.apiUrl}/api/v1/api/users/doctors`;
    console.log('Fetching doctors from:', url);
    return this.http.get<Doctor[]>(url);
  }

  getAcceptedDoctors(): Observable<Doctor[]> {
    const url = `${this.apiUrl}/api/v1/api/users/doctors/accepted`;
    console.log('Fetching accepted doctors from:', url);
    return this.http.get<Doctor[]>(url);
  }

  getDoctorById(id: number): Observable<Doctor> {
    const url = `${this.apiUrl}/api/v1/api/users/${id}`;
    console.log('Fetching doctor by ID from:', url);
    return this.http.get<Doctor>(url);
  }

  applyForPosition(applicationData: any): Observable<any> {
    const url = `${this.apiUrl}/api/v1/demandes`;
    console.log('Applying for position at:', url);
    return this.http.post(url, applicationData);
  }
}