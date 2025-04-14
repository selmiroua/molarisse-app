import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SecretaryService } from '../secretary.service';
import { Doctor } from '../../models/doctor.model';
import { environment } from '../../../environments/environment';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-doctor-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTooltipModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule
  ],
  template: `
    <div class="doctors-container">
      <header class="page-header">
        <h1>Nos Médecins</h1>
        <p class="subtitle">Trouvez le spécialiste qui vous convient</p>
      </header>

      <!-- Loading State -->
      <div class="loading-state" *ngIf="isLoading">
        <mat-spinner diameter="40"></mat-spinner>
        <p>Chargement des médecins...</p>
      </div>

      <!-- Doctors Grid -->
      <div class="doctors-grid" *ngIf="!isLoading && !error && doctors.length > 0">
        <mat-card *ngFor="let doctor of doctors" class="doctor-card">
          <!-- Doctor Image and Favorite -->
          <div class="doctor-image-container">
            <img [src]="getProfilePictureUrl(doctor)" 
                 [alt]="doctor.nom + ' ' + doctor.prenom"
                 (error)="handleImageError($event)"
                 class="doctor-image">
            <button mat-icon-button class="favorite-button">
              <mat-icon>favorite_border</mat-icon>
            </button>
            <div class="rating">
              <mat-icon class="star-icon">star</mat-icon>
              <span>4.8</span>
            </div>
          </div>

          <!-- Doctor Info -->
          <div class="doctor-content">
            <div class="specialty-badge" [ngStyle]="{'background-color': getSpecialtyColor(doctor.specialite)}">
              {{ doctor.specialite || 'Non spécifié' }}
            </div>
            
            <div class="availability-badge" *ngIf="doctor.disponibilite">
              <mat-icon class="status-icon">circle</mat-icon>
              <span>Disponible</span>
            </div>

            <h2 class="doctor-name">Dr. {{ doctor.nom }} {{ doctor.prenom }}</h2>
            
            <div class="location">
              <mat-icon>location_on</mat-icon>
              <span>{{ doctor.ville || doctor.address || 'Non spécifié' }}</span>
            </div>

            <div class="info-grid">
              <div class="info-item">
                <mat-icon>work_history</mat-icon>
                <span>{{ doctor.anneeExperience || '5' }} ans d'exp.</span>
              </div>
              <div class="info-item">
                <mat-icon>schedule</mat-icon>
                <span>{{ doctor.disponibilite || 'Flexible' }}</span>
              </div>
              <div class="info-item price">
                <mat-icon>euro</mat-icon>
                <span>{{ doctor.prixConsultation || '100' }}€ / acte</span>
              </div>
            </div>

            <button mat-flat-button color="primary" class="request-button" (click)="handleRequestClick(doctor)">
              <mat-icon>work</mat-icon>
              Soumettre une candidature
            </button>
          </div>
        </mat-card>
      </div>

      <!-- Request Form Dialog -->
      <div *ngIf="showRequestForm" class="request-form-overlay">
        <div class="request-form-container">
          <h2>Demande de collaboration avec Dr. {{selectedDoctor?.nom}} {{selectedDoctor?.prenom}}</h2>
          
          <form [formGroup]="requestForm" (ngSubmit)="submitRequest()">
            <div class="form-section">
              <h3>Informations Personnelles</h3>
              
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Nom</mat-label>
                  <input matInput formControlName="nom" placeholder="Votre nom">
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Prénom</mat-label>
                  <input matInput formControlName="prenom" placeholder="Votre prénom">
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Email</mat-label>
                  <input matInput formControlName="email" placeholder="votre@email.com">
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Téléphone</mat-label>
                  <input matInput formControlName="telephone" placeholder="12345678">
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Date de naissance</mat-label>
                  <input matInput [matDatepicker]="picker" formControlName="dateNaissance">
                  <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                  <mat-datepicker #picker></mat-datepicker>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Adresse</mat-label>
                  <input matInput formControlName="adresse" placeholder="Votre adresse">
                </mat-form-field>
              </div>
            </div>

            <div class="form-section">
              <h3>Expérience Professionnelle</h3>
              
              <mat-checkbox formControlName="hasExperience">
                J'ai de l'expérience en tant que secrétaire médicale
              </mat-checkbox>

              <div *ngIf="requestForm.get('hasExperience')?.value" class="experience-fields">
                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Années d'expérience</mat-label>
                    <input matInput type="number" formControlName="anneeExperience" min="0">
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Dernier employeur</mat-label>
                    <input matInput formControlName="dernierEmployeur" placeholder="Nom du cabinet/clinique">
                  </mat-form-field>
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3>CV et Motivation</h3>
              
              <div class="cv-upload">
                <input type="file" #fileInput style="display: none" 
                       (change)="onCVSelected($event)" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png">
                <button type="button" mat-stroked-button (click)="fileInput.click()">
                  <mat-icon>upload_file</mat-icon>
                  Télécharger votre CV
                </button>
                <span class="file-name" *ngIf="cvFileName">{{cvFileName}}</span>
              </div>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Lettre de motivation</mat-label>
                <textarea matInput formControlName="motivation" rows="4"
                  placeholder="Expliquez pourquoi vous souhaitez travailler avec ce médecin"></textarea>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button type="button" mat-button (click)="cancelRequest()">Annuler</button>
              <button type="submit" mat-raised-button color="primary" 
                      [disabled]="requestForm.invalid || isSubmitting">
                {{isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande'}}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .doctors-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
      background: #f8f9fa;
    }

    .page-header {
      text-align: center;
      margin-bottom: 3rem;
      
      h1 {
        font-size: 2.5rem;
        color: #2c3e50;
        margin-bottom: 0.5rem;
      }

      .subtitle {
        color: #6c757d;
        font-size: 1.1rem;
      }
    }

    .doctors-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 2rem;
    }

    .doctor-card {
      border-radius: 16px;
      overflow: hidden;
      background: white;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      transition: transform 0.2s ease, box-shadow 0.2s ease;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
      }
    }

    .doctor-image-container {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .doctor-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .favorite-button {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(255, 255, 255, 0.9);
      mat-icon {
        color: #ff4081;
      }
    }

    .rating {
      position: absolute;
      bottom: 10px;
      right: 10px;
      background: rgba(255, 255, 255, 0.9);
      padding: 4px 8px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 4px;

      .star-icon {
        color: #ffc107;
        font-size: 18px;
        height: 18px;
        width: 18px;
      }

      span {
        color: #2c3e50;
        font-weight: 500;
      }
    }

    .doctor-content {
      padding: 1.5rem;
    }

    .specialty-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      color: white;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .availability-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 12px;
      border-radius: 20px;
      background: #e8f5e9;
      color: #2e7d32;
      font-size: 0.9rem;
      margin-left: 0.5rem;

      .status-icon {
        font-size: 12px;
        height: 12px;
        width: 12px;
      }
    }

    .doctor-name {
      margin: 1rem 0;
      color: #2c3e50;
      font-size: 1.3rem;
      font-weight: 600;
    }

    .location {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #6c757d;
      margin-bottom: 1rem;

      mat-icon {
        font-size: 18px;
        height: 18px;
        width: 18px;
      }
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin: 1rem 0;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #6c757d;

      mat-icon {
        font-size: 20px;
        height: 20px;
        width: 20px;
      }

      &.price {
        color: #2c3e50;
        font-weight: 500;
      }
    }

    .request-button {
      width: 100%;
      margin-top: 1rem;
      border-radius: 8px;
      height: 48px;
      font-size: 1.1rem;
      background-color: #4254b5;
      
      mat-icon {
        margin-right: 8px;
      }
    }

    .request-form-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .request-form-container {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      width: 90%;
      max-width: 800px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      position: relative;

      h2 {
        margin-bottom: 1.5rem;
        color: #2c3e50;
        position: sticky;
        top: 0;
        background: white;
        padding: 1rem 0;
        z-index: 1;
      }
    }

    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
      padding: 1rem;
      background: #f8f9fa;
      position: sticky;
      bottom: 0;
      border-top: 1px solid #e9ecef;

      button {
        min-width: 120px;
        height: 44px;
        
        &[type="submit"] {
          background-color: #4254b5;
          color: white;
          font-weight: 500;
          
          &:disabled {
            background-color: #cccccc;
          }
        }
      }
    }

    .form-section {
      margin-bottom: 2rem;

      h3 {
        color: #2c3e50;
        margin-bottom: 1rem;
        font-size: 1.1rem;
      }
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .experience-fields {
      margin-top: 1rem;
    }

    .cv-upload {
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 1rem;

      button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .file-name {
        color: #4254b5;
        font-size: 0.9rem;
      }
    }

    mat-checkbox {
      margin-bottom: 1rem;
      display: block;
    }
  `]
})
export class DoctorListComponent implements OnInit, OnDestroy {
  doctors: Doctor[] = [];
  isLoading = false;
  error: string | null = null;
  private profilePictureUrls = new Map<number, string>();
  showRequestForm = false;
  selectedDoctor: Doctor | null = null;
  requestForm: FormGroup;
  isSubmitting = false;
  cvFileName: string | null = null;

  constructor(
    private secretaryService: SecretaryService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.requestForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      dateNaissance: ['', Validators.required],
      adresse: ['', Validators.required],
      hasExperience: [false],
      anneeExperience: [''],
      dernierEmployeur: [''],
      cv: [null, Validators.required],
      motivation: ['', [Validators.required, Validators.minLength(50)]]
    });

    // Enable/disable experience-related fields based on hasExperience
    this.requestForm.get('hasExperience')?.valueChanges.subscribe(hasExp => {
      const anneeExp = this.requestForm.get('anneeExperience');
      const dernierEmp = this.requestForm.get('dernierEmployeur');
      if (hasExp) {
        anneeExp?.setValidators([Validators.required, Validators.min(0)]);
        dernierEmp?.setValidators([Validators.required]);
      } else {
        anneeExp?.clearValidators();
        dernierEmp?.clearValidators();
      }
      anneeExp?.updateValueAndValidity();
      dernierEmp?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.loadAcceptedDoctors();
  }

  loadAcceptedDoctors(): void {
    this.isLoading = true;
    this.error = null;
    this.secretaryService.getAcceptedDoctors().subscribe({
      next: (doctors) => {
        console.log('Received doctors:', doctors);
        this.doctors = doctors;
        // Load profile pictures for each doctor
        this.doctors.forEach(doctor => {
          console.log('Processing doctor:', doctor.email, 'Photo path:', doctor.photoPath);
          if (doctor.photoPath) {
            this.loadProfilePicture(doctor);
          }
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading doctors:', error);
        this.error = 'Erreur lors du chargement des médecins';
        this.isLoading = false;
      }
    });
  }

  private loadProfilePicture(doctor: Doctor): void {
    if (!doctor.photoPath || this.profilePictureUrls.has(doctor.id)) {
      return;
    }

    console.log('Loading profile picture for doctor:', doctor.email, 'Path:', doctor.photoPath);
    this.secretaryService.getProfilePicture(doctor.photoPath).subscribe({
      next: (blob) => {
        console.log('Received blob for doctor:', doctor.email, 'Size:', blob.size, 'Type:', blob.type);
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          console.log('Converted to base64 for doctor:', doctor.email, 'Data length:', base64data.length);
          this.profilePictureUrls.set(doctor.id, base64data);
          // Force change detection
          this.doctors = [...this.doctors];
        };
        reader.readAsDataURL(blob);
      },
      error: (error) => {
        console.error('Error loading profile picture for doctor:', doctor.email, error);
        this.profilePictureUrls.set(doctor.id, 'assets/images/default-avatar.png');
      }
    });
  }

  getProfilePictureUrl(doctor: Doctor): string {
    // If we already have a loaded picture, use it
    if (this.profilePictureUrls.has(doctor.id)) {
      return this.profilePictureUrls.get(doctor.id)!;
    }

    // If we have a path and haven't tried loading it yet, trigger the load
    if (doctor.photoPath) {
      this.loadProfilePicture(doctor);
    }

    // Return default while loading
    return 'assets/images/default-avatar.png';
  }

  ngOnDestroy(): void {
    // Clean up any resources
    this.profilePictureUrls.clear();
  }

  handleImageError(event: any): void {
    console.error('Image failed to load:', event.target.src);
    event.target.src = 'assets/images/default-avatar.png';
  }

  getSpecialtyColor(specialite: string | undefined): string {
    if (!specialite) return '#4254b5';
    
    // Debug log to see what specialty we're trying to color
    console.log('Getting color for specialite:', specialite);
    
    const colors: { [key: string]: string } = {
      'Généraliste': '#4CAF50',
      'Cardiologue': '#E91E63',
      'Pédiatre': '#2196F3',
      'Dermatologue': '#FF9800',
      'Psychiatre': '#9C27B0',
      'Dentiste': '#009688',
      'Ophtalmologue': '#673AB7',
      'ORL': '#795548',
      'Gynécologue': '#FF4081',
      'Neurologue': '#607D8B',
      'Orthopédiste': '#FFC107',
      'Pneumologue': '#00BCD4',
      'Rhumatologue': '#8BC34A',
      'Gastro-entérologue': '#FF5722',
      'Endocrinologue': '#9C27B0',
      'Urologue': '#3F51B5',
      'Chirurgien': '#F44336'
    };
    
    return colors[specialite] || '#4254b5';
  }

  handleRequestClick(doctor: Doctor): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.selectedDoctor = doctor;
    this.showRequestForm = true;
  }

  cancelRequest(): void {
    this.showRequestForm = false;
    this.selectedDoctor = null;
    this.requestForm.reset();
  }

  onCVSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg', 'image/png'];
      
      if (!allowedTypes.includes(file.type)) {
        this.snackBar.open('Format de fichier non supporté. Veuillez utiliser PDF, DOC, DOCX, JPG ou PNG.', 'Fermer', {
          duration: 5000
        });
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        this.snackBar.open('Le fichier est trop volumineux. Taille maximum: 5MB', 'Fermer', {
          duration: 5000
        });
        return;
      }

      this.cvFileName = file.name;
      this.requestForm.patchValue({ cv: file });
    }
  }

  submitRequest(): void {
    if (this.requestForm.invalid || !this.selectedDoctor) {
      return;
    }

    this.isSubmitting = true;
    const formData = new FormData();
    formData.append('doctorId', this.selectedDoctor.id.toString());
    formData.append('cv', this.requestForm.get('cv')?.value);
    
    Object.keys(this.requestForm.value).forEach(key => {
      if (key !== 'cv') {
        formData.append(key, this.requestForm.get(key)?.value);
      }
    });

    this.secretaryService.sendDoctorRequest(formData).subscribe({
      next: () => {
        this.snackBar.open('Votre demande a été envoyée avec succès!', 'Fermer', {
          duration: 5000
        });
        this.isSubmitting = false;
        this.cancelRequest();
      },
      error: (error) => {
        console.error('Error sending request:', error);
        this.snackBar.open('Erreur lors de l\'envoi de la demande. Veuillez réessayer.', 'Fermer', {
          duration: 5000
        });
        this.isSubmitting = false;
      }
    });
  }
}

    
   