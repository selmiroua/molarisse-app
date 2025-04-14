import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export enum AppointmentStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED'
}

export enum CaseType {
  REGULAR = 'REGULAR',
  URGENT = 'URGENT',
  FOLLOWUP = 'FOLLOWUP'
}

export enum AppointmentType {
  CONSULTATION = 'CONSULTATION',
  CHECKUP = 'CHECKUP',
  PROCEDURE = 'PROCEDURE',
  OTHER = 'OTHER'
}

export interface AppointmentRequest {
  patientId: number;
  doctorId: number;
  appointmentDateTime: string;
  caseType: CaseType;
  appointmentType: AppointmentType;
  notes?: string;
}

export interface StatusUpdateRequest {
  status: AppointmentStatus;
  secretaryId?: number;
}

export interface Appointment {
  id: number;
  appointmentDateTime: string;
  status: AppointmentStatus;
  caseType: CaseType;
  appointmentType: AppointmentType;
  notes?: string;
  patient?: any;
  doctor?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}/api/v1/appointments`;

  constructor(private http: HttpClient) { }

  // Book a new appointment
  bookAppointment(request: AppointmentRequest): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.apiUrl}/book`, request);
  }

  // Get appointments for the current patient
  getMyAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/my-appointments`);
  }

  // Get appointments for the current doctor
  getMyDoctorAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/my-doctor-appointments`);
  }

  // Get appointments for the current secretary
  getMySecretaryAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/my-secretary-appointments`);
  }

  // Update appointment status (for secretary)
  updateAppointmentStatus(appointmentId: number, statusUpdate: StatusUpdateRequest): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/update-status?appointmentId=${appointmentId}`, statusUpdate);
  }

  // Update appointment status (for doctor)
  updateMyAppointmentStatus(appointmentId: number, status: AppointmentStatus): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/update-my-appointment-status?appointmentId=${appointmentId}`, { status });
  }

  // Add this to AppointmentService
  testAuth(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/test-auth`);
  }
} 
