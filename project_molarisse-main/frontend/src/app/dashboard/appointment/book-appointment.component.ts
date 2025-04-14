import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatNativeDateModule } from '@angular/material/core';
import { Router } from '@angular/router';
import { AppointmentService, AppointmentType, CaseType } from '../../core/services/appointment.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// Define this inline instead of importing from a non-existent file
export interface User {
  id: number;
  nom: string;
  prenom: string;
  specialization: string;
}

// Environment values defined inline
const environment = {
  apiUrl: 'http://localhost:8080/api/v1'
};

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatNativeDateModule,
    HttpClientModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Book New Appointment</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="appointmentForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Select Doctor</mat-label>
              <mat-select formControlName="doctorId" required>
                <mat-option *ngFor="let doctor of doctors" [value]="doctor.id">
                  Dr. {{ doctor.prenom }} {{ doctor.nom }} ({{ doctor.specialization }})
                </mat-option>
              </mat-select>
              <mat-error *ngIf="appointmentForm.get('doctorId')?.hasError('required')">
                Please select a doctor
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Date & Time</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="appointmentDate" required>
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-error *ngIf="appointmentForm.get('appointmentDate')?.hasError('required')">
                Please select a date
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Time</mat-label>
              <input matInput type="time" formControlName="appointmentTime" required>
              <mat-error *ngIf="appointmentForm.get('appointmentTime')?.hasError('required')">
                Please select a time
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Case Type</mat-label>
              <mat-select formControlName="caseType" required>
                <mat-option [value]="CaseType.REGULAR">Regular</mat-option>
                <mat-option [value]="CaseType.URGENT">Urgent</mat-option>
                <mat-option [value]="CaseType.FOLLOWUP">Follow-up</mat-option>
              </mat-select>
              <mat-error *ngIf="appointmentForm.get('caseType')?.hasError('required')">
                Please select a case type
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Appointment Type</mat-label>
              <mat-select formControlName="appointmentType" required>
                <mat-option [value]="AppointmentType.CONSULTATION">Consultation</mat-option>
                <mat-option [value]="AppointmentType.CHECKUP">Check-up</mat-option>
                <mat-option [value]="AppointmentType.PROCEDURE">Procedure</mat-option>
                <mat-option [value]="AppointmentType.OTHER">Other</mat-option>
              </mat-select>
              <mat-error *ngIf="appointmentForm.get('appointmentType')?.hasError('required')">
                Please select appointment type
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Notes (optional)</mat-label>
              <textarea matInput rows="4" formControlName="notes"></textarea>
            </mat-form-field>

            <div class="button-container">
              <button mat-button type="button" routerLink="/dashboard/patient">Cancel</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="appointmentForm.invalid || loading">
                {{ loading ? 'Booking...' : 'Book Appointment' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 30px auto;
      padding: 0 20px;
    }
    
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
    
    .button-container {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }
    
    mat-card {
      padding: 20px;
    }
    
    mat-card-header {
      margin-bottom: 20px;
    }
  `]
})
export class BookAppointmentComponent implements OnInit {
  appointmentForm: FormGroup;
  loading = false;
  doctors: User[] = [];
  CaseType = CaseType;
  AppointmentType = AppointmentType;
  
  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private snackBar: MatSnackBar,
    private router: Router,
    private http: HttpClient
  ) {
    this.appointmentForm = this.fb.group({
      doctorId: ['', Validators.required],
      appointmentDate: ['', Validators.required],
      appointmentTime: ['', Validators.required],
      caseType: [CaseType.REGULAR, Validators.required],
      appointmentType: [AppointmentType.CONSULTATION, Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.http.get<User[]>(`${environment.apiUrl}/users/doctors`)
      .subscribe({
        next: (doctors) => {
          this.doctors = doctors;
          console.log('Fetched doctors:', doctors);
        },
        error: (error) => {
          console.error('Error fetching doctors:', error);
          this.snackBar.open('Failed to load doctors. Please try again later.', 'Close', { duration: 5000 });
          
          // Fallback to dummy data if API fails
          this.doctors = [
            { id: 1, nom: 'Smith', prenom: 'John', specialization: 'Cardiology' },
            { id: 2, nom: 'Johnson', prenom: 'Sarah', specialization: 'Neurology' },
            { id: 3, nom: 'Williams', prenom: 'Robert', specialization: 'Pediatrics' }
          ];
        }
      });
  }

  onSubmit(): void {
    if (this.appointmentForm.invalid) return;
    
    this.loading = true;
    
    const formValues = this.appointmentForm.value;
    const date = formValues.appointmentDate;
    const timeParts = formValues.appointmentTime.split(':');
    
    date.setHours(parseInt(timeParts[0], 10), parseInt(timeParts[1], 10));
    
    const appointmentRequest = {
      patientId: 1,
      doctorId: formValues.doctorId,
      appointmentDateTime: date.toISOString(),
      caseType: formValues.caseType,
      appointmentType: formValues.appointmentType,
      notes: formValues.notes
    };
    
    this.appointmentService.bookAppointment(appointmentRequest).subscribe({
      next: () => {
        this.snackBar.open('Appointment booked successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/dashboard/patient']);
      },
      error: (err) => {
        console.error('Error booking appointment', err);
        this.snackBar.open('Failed to book appointment. Please try again.', 'Close', { duration: 5000 });
        this.loading = false;
      }
    });
  }
} 