import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SecretaryService } from './secretary.service';
import { Doctor } from '../models/doctor.model';

@Component({
  selector: 'app-accepted-doctors',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Médecins acceptés</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div *ngIf="loading" class="loading-spinner">
            <mat-spinner diameter="40"></mat-spinner>
          </div>

          <div *ngIf="!loading && doctors.length === 0" class="no-data">
            <p>Aucun médecin accepté trouvé.</p>
          </div>

          <table *ngIf="!loading && doctors.length > 0" mat-table [dataSource]="doctors" class="doctors-table">
            <!-- Name Column -->
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Nom</th>
              <td mat-cell *matCellDef="let doctor">
                Dr. {{ doctor.prenom }} {{ doctor.nom }}
              </td>
            </ng-container>

            <!-- Speciality Column -->
            <ng-container matColumnDef="speciality">
              <th mat-header-cell *matHeaderCellDef>Spécialité</th>
              <td mat-cell *matCellDef="let doctor">{{ doctor.specialite }}</td>
            </ng-container>

            <!-- Location Column -->
            <ng-container matColumnDef="location">
              <th mat-header-cell *matHeaderCellDef>Cabinet</th>
              <td mat-cell *matCellDef="let doctor">
                {{ doctor.nomCabinet || 'N/A' }}
                <br>
                <small>{{ doctor.ville }}</small>
              </td>
            </ng-container>

            <!-- Contact Column -->
            <ng-container matColumnDef="contact">
              <th mat-header-cell *matHeaderCellDef>Contact</th>
              <td mat-cell *matCellDef="let doctor">
                {{ doctor.email }}
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      padding: 20px;
    }

    .no-data {
      text-align: center;
      padding: 20px;
      color: rgba(0, 0, 0, 0.54);
    }

    .doctors-table {
      width: 100%;
    }

    .mat-mdc-row:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    .mat-mdc-cell {
      padding: 16px 8px;
    }
  `]
})
export class AcceptedDoctorsComponent implements OnInit {
  doctors: Doctor[] = [];
  loading = true;
  displayedColumns: string[] = ['name', 'speciality', 'location', 'contact'];

  constructor(private secretaryService: SecretaryService) {}

  ngOnInit(): void {
    this.loadAcceptedDoctors();
  }

  loadAcceptedDoctors(): void {
    this.loading = true;
    this.secretaryService.getAcceptedDoctors().subscribe({
      next: (doctors) => {
        this.doctors = doctors;
        this.loading = false;
        console.log('Loaded accepted doctors:', doctors);
      },
      error: (error) => {
        console.error('Error loading accepted doctors:', error);
        this.loading = false;
      }
    });
  }
} 