import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppointmentService, Appointment, AppointmentStatus } from '../../core/services/appointment.service';


@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule,
    MatBadgeModule,
    MatSnackBarModule
  ],
  template: `
    <div class="appointment-container">
      <div class="header">
        <h2>{{ title }}</h2>
        <button *ngIf="userRole === 'patient'" mat-raised-button color="primary" (click)="navigateToBooking()">
          Book New Appointment
        </button>
      </div>

      <div *ngIf="loading" class="loading">
        Loading appointments...
      </div>

      <div *ngIf="!loading && appointments.length === 0" class="no-data">
        No appointments found.
      </div>

      <table *ngIf="!loading && appointments.length > 0" mat-table [dataSource]="appointments" class="appointment-table">
        <!-- Date Column -->
        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef>Date & Time</th>
          <td mat-cell *matCellDef="let appointment">
            {{ formatDate(appointment.appointmentDateTime) }}
          </td>
        </ng-container>

        <!-- Status Column -->
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let appointment">
            <span class="status-badge" [ngClass]="getStatusClass(appointment.status)">
              {{ appointment.status }}
            </span>
          </td>
        </ng-container>

        <!-- Type Column -->
        <ng-container matColumnDef="type">
          <th mat-header-cell *matHeaderCellDef>Type</th>
          <td mat-cell *matCellDef="let appointment">
            {{ appointment.appointmentType }}
          </td>
        </ng-container>

        <!-- Case Column -->
        <ng-container matColumnDef="case">
          <th mat-header-cell *matHeaderCellDef>Case</th>
          <td mat-cell *matCellDef="let appointment">
            {{ appointment.caseType }}
          </td>
        </ng-container>

        <!-- Doctor/Patient Column -->
        <ng-container matColumnDef="person">
          <th mat-header-cell *matHeaderCellDef>{{ userRole === 'patient' ? 'Doctor' : 'Patient' }}</th>
          <td mat-cell *matCellDef="let appointment">
            <ng-container *ngIf="userRole === 'patient' && appointment.doctor">
              Dr. {{ appointment.doctor.prenom }} {{ appointment.doctor.nom }}
            </ng-container>
            <ng-container *ngIf="userRole !== 'patient' && appointment.patient">
              {{ appointment.patient.prenom }} {{ appointment.patient.nom }}
            </ng-container>
          </td>
        </ng-container>

        <!-- Actions Column -->
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let appointment">
            <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Actions">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #menu="matMenu">
              <button mat-menu-item (click)="viewDetails(appointment)">
                <mat-icon>visibility</mat-icon>
                <span>View Details</span>
              </button>

              <!-- Status update options for doctor/secretary -->
              <ng-container *ngIf="userRole === 'doctor' || userRole === 'secretaire'">
                <button mat-menu-item
                        *ngIf="appointment.status === 'PENDING'"
                        (click)="updateStatus(appointment, AppointmentStatus.ACCEPTED)">
                  <mat-icon>check_circle</mat-icon>
                  <span>Accept</span>
                </button>

                <button mat-menu-item
                        *ngIf="appointment.status === 'PENDING'"
                        (click)="updateStatus(appointment, AppointmentStatus.REJECTED)">
                  <mat-icon>cancel</mat-icon>
                  <span>Reject</span>
                </button>

                <button mat-menu-item
                        *ngIf="appointment.status === 'ACCEPTED'"
                        (click)="updateStatus(appointment, AppointmentStatus.COMPLETED)">
                  <mat-icon>task_alt</mat-icon>
                  <span>Mark as Completed</span>
                </button>
              </ng-container>

              <!-- Cancel option for patients -->
              <button mat-menu-item
                      *ngIf="userRole === 'patient' && (appointment.status === 'PENDING' || appointment.status === 'ACCEPTED')"
                      (click)="cancelAppointment(appointment)">
                <mat-icon>event_busy</mat-icon>
                <span>Cancel Appointment</span>
              </button>
            </mat-menu>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .appointment-container {
      margin: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .appointment-table {
      width: 100%;
    }

    .loading, .no-data {
      padding: 20px;
      text-align: center;
      color: rgba(0, 0, 0, 0.54);
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
    }

    .pending {
      background-color: #ffecb3;
      color: #ff8f00;
    }

    .accepted {
      background-color: #c8e6c9;
      color: #2e7d32;
    }

    .rejected {
      background-color: #ffcdd2;
      color: #c62828;
    }

    .completed {
      background-color: #e1f5fe;
      color: #0277bd;
    }

    .canceled {
      background-color: #f5f5f5;
      color: #616161;
    }
  `]
})
export class AppointmentListComponent implements OnInit {
  @Input() userRole!: 'patient' | 'doctor' | 'secretaire';
  appointments: Appointment[] = [];
  loading = true;
  displayedColumns: string[] = ['date', 'status', 'type', 'case', 'person', 'actions'];
  title = 'Appointments';
  AppointmentStatus = AppointmentStatus;

  constructor(
    private appointmentService: AppointmentService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAppointments();

    // Set title based on user role
    if (this.userRole === 'patient') {
      this.title = 'Mes rendez-vous';
    } else if (this.userRole === 'doctor') {
      this.title = 'Rendez-vous médecin';
    } else if (this.userRole === 'secretaire') {
      this.title = 'Gestion des rendez-vous';
    }
  }

  loadAppointments(): void {
    this.loading = true;

    // Debug logging
    console.log('Loading appointments for role:', this.userRole);
    console.log('JWT token available:', !!localStorage.getItem('access_token'));
    console.log('JWT token:', localStorage.getItem('access_token'));

    if (this.userRole === 'patient') {
      this.appointmentService.getMyAppointments().subscribe({
        next: (data) => {
          this.appointments = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading appointments', error);
          this.loading = false;
        }
      });
    } else if (this.userRole === 'doctor') {
      console.log('Making request to:', `${this.appointmentService['apiUrl']}/my-doctor-appointments`);
      this.appointmentService.getMyDoctorAppointments().subscribe({
        next: (data) => {
          this.appointments = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading appointments', error);
          this.loading = false;
        }
      });
    } else if (this.userRole === 'secretaire') {
      this.appointmentService.getMySecretaryAppointments().subscribe({
        next: (data) => {
          this.appointments = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading appointments', error);
          this.loading = false;
        }
      });
    }
  }

  formatDate(dateTime: string): string {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  navigateToBooking(): void {
    this.router.navigate(['/dashboard/patient/book-appointment']);
  }

  viewDetails(appointment: Appointment): void {
    // Navigate to appointment details page
    // this.router.navigate([`/dashboard/${this.userRole}/appointment/${appointment.id}`]);

    // For now, just show the details in a snackbar
    this.snackBar.open(`Viewing details for appointment #${appointment.id}`, 'Close', { duration: 3000 });
  }

  updateStatus(appointment: Appointment, status: AppointmentStatus): void {
    if (this.userRole === 'doctor') {
      this.appointmentService.updateMyAppointmentStatus(appointment.id, status).subscribe({
        next: () => {
          this.snackBar.open(`Appointment status updated to ${status}`, 'Close', { duration: 3000 });
          this.loadAppointments(); // Reload the list
        },
        error: (error) => {
          console.error('Error updating appointment status', error);
          this.snackBar.open('Failed to update appointment status', 'Close', { duration: 3000 });
        }
      });
    } else if (this.userRole === 'secretaire') {
      // Here we'd get the secretaryId from the auth service
      const secretaryId = 1; // Placeholder

      this.appointmentService.updateAppointmentStatus(appointment.id, {
        status,
        secretaryId
      }).subscribe({
        next: () => {
          this.snackBar.open(`Appointment status updated to ${status}`, 'Close', { duration: 3000 });
          this.loadAppointments(); // Reload the list
        },
        error: (error) => {
          console.error('Error updating appointment status', error);
          this.snackBar.open('Failed to update appointment status', 'Close', { duration: 3000 });
        }
      });
    }
  }

  cancelAppointment(appointment: Appointment): void {
    // This would be implemented with a confirmation dialog
    this.snackBar.open('Appointment cancellation not implemented yet', 'Close', { duration: 3000 });
  }
}
