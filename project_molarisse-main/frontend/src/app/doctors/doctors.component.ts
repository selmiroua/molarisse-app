import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface Doctor {
  id: number;
  nom: string;
  prenom: string;
  specialite: string;
  ville: string;
  nomCabinet: string;
  rating: number;
  photoPath: string;
  disponible: boolean;
}

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  template: `
    <div class="doctors-container">
      <div class="doctors-header">
        <h2>Showing {{ doctors.length }} Doctors For You</h2>
        <div class="filters">
          <div class="search-filters">
            <div class="availability-filter">
              <span>Availability</span>
              <mat-icon>expand_more</mat-icon>
            </div>
            <div class="sort-by">
              <span>Sort By</span>
              <span>Price (Low to High)</span>
              <mat-icon>expand_more</mat-icon>
            </div>
          </div>
          <div class="view-options">
            <mat-icon>grid_view</mat-icon>
            <mat-icon>format_list_bulleted</mat-icon>
            <mat-icon>place</mat-icon>
          </div>
        </div>
      </div>

      <div class="doctors-grid">
        <mat-card *ngFor="let doctor of doctors" class="doctor-card">
          <div class="doctor-rating">
            <mat-icon>star</mat-icon>
            <span>{{ doctor.rating }}</span>
            <button mat-icon-button class="favorite-button" matTooltip="Add to favorites">
              <mat-icon>favorite_border</mat-icon>
            </button>
          </div>

          <img [src]="doctor.photoPath || 'assets/images/default-doctor.png'"
               [alt]="doctor.nom + ' ' + doctor.prenom"
               class="doctor-photo">

          <div class="doctor-info">
            <div class="doctor-specialty">{{ doctor.specialite }}</div>
            <h3>Dr. {{ doctor.nom }} {{ doctor.prenom }}</h3>
            <div class="doctor-location">
              <mat-icon>place</mat-icon>
              <span>{{ doctor.ville }}</span>
            </div>
          </div>

          <div class="doctor-footer">
            <div class="consultation-info">
              <span class="label">Consultation Fees</span>
              <span class="price">60 DT</span>
            </div>
            <div class="action-buttons">
              <button mat-icon-button color="primary" matTooltip="Send message"
                      (click)="sendMessage(doctor)">
                <mat-icon>message</mat-icon>
              </button>
              <button mat-raised-button color="primary" class="book-button">
                Book Now
              </button>
            </div>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .doctors-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .doctors-header {
      margin-bottom: 20px;
    }

    .doctors-header h2 {
      font-size: 24px;
      margin-bottom: 16px;
    }

    .filters {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .search-filters {
      display: flex;
      gap: 20px;
    }

    .availability-filter, .sort-by {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    .view-options {
      display: flex;
      gap: 12px;
    }

    .doctors-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .doctor-card {
      position: relative;
      padding: 16px;
    }

    .doctor-rating {
      position: absolute;
      top: 16px;
      left: 16px;
      display: flex;
      align-items: center;
      gap: 4px;
      background: rgba(255, 255, 255, 0.9);
      padding: 4px 8px;
      border-radius: 16px;
    }

    .favorite-button {
      position: absolute;
      top: 8px;
      right: 8px;
    }

    .doctor-photo {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 16px;
    }

    .doctor-info {
      margin-bottom: 16px;
    }

    .doctor-specialty {
      color: #2196F3;
      margin-bottom: 8px;
    }

    .doctor-location {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #666;
    }

    .doctor-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 16px;
    }

    .consultation-info {
      display: flex;
      flex-direction: column;
    }

    .label {
      font-size: 12px;
      color: #666;
    }

    .price {
      font-size: 18px;
      font-weight: bold;
      color: #FF5722;
    }

    .action-buttons {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .book-button {
      min-width: 100px;
    }
  `]
})
export class DoctorsComponent implements OnInit {
  doctors: Doctor[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadAcceptedDoctors();
  }

  loadAcceptedDoctors() {
    this.http.get<Doctor[]>(`${environment.apiUrl}/api/v1/doctors/accepted`)
      .subscribe({
        next: (doctors) => {
          this.doctors = doctors;
        },
        error: (error) => {
          console.error('Error loading doctors:', error);
        }
      });
  }

  sendMessage(doctor: Doctor) {
    // TODO: Implement messaging functionality
    console.log('Sending message to doctor:', doctor);
  }
}