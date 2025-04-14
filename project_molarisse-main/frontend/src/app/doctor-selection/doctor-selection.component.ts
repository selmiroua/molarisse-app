import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { DoctorService } from '../services/doctor.service';
import { Doctor } from '../models/doctor.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // For loading indicator
import { ProfileImageService } from '../shared/profile-image.service'; // To display doctor images
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-doctor-selection',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './doctor-selection.component.html',
  styleUrls: ['./doctor-selection.component.scss']
})
export class DoctorSelectionComponent implements OnInit {
  acceptedDoctors$: Observable<Doctor[]> | undefined;
  environment = environment; // Make it available to the template

  constructor(
    private doctorService: DoctorService,
    public profileImageService: ProfileImageService // Make public for template use
  ) {}

  ngOnInit(): void {
    this.acceptedDoctors$ = this.doctorService.getAcceptedDoctors();
    // Add debugging
    this.acceptedDoctors$.subscribe({
      next: (doctors) => {
        doctors.forEach(doctor => {
          console.log('Doctor:', doctor.nom, 'Photo path:', doctor.photoPath);
          console.log('Full photo URL:', environment.apiUrl + doctor.photoPath);
        });
      },
      error: (err) => console.error('Error loading accepted doctors for selection:', err)
    });
  }

  selectDoctor(doctor: Doctor): void {
    // Placeholder action: Log the selected doctor
    // TODO: Implement the actual logic for what happens when a doctor is selected
    // (e.g., navigate to a specific chat, assign tasks, etc.)
    console.log('Secretary selected doctor:', doctor);
    // Example: Navigate to a hypothetical dashboard for this doctor
    // this.router.navigate(['/secretary/doctor-workspace', doctor.id]);
  }

  handleImageError(event: any): void {
    console.error('Image failed to load:', event.target.src);
    event.target.src = 'assets/images/default-avatar.png';
  }
}
