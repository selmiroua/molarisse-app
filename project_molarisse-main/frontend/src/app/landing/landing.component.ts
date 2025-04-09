import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatRippleModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    MatToolbarModule,
    MatSidenavModule,
    MatMenuModule,
    MatTabsModule,
    MatGridListModule,
    MatChipsModule,
    MatBadgeModule,
    MatRippleModule,
    MatExpansionModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatBottomSheetModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTreeModule,
    MatButtonToggleModule
  ]
})
export class LandingComponent implements OnInit {
  services = [
    {
      title: 'Consultations Dentaires',
      description: 'Consultations générales et spécialisées pour tous les membres de la famille',
      icon: 'medical_services',
      color: '#4CAF50'
    },
    {
      title: 'Orthodontie',
      description: 'Correction des dents et de la mâchoire pour un sourire parfait',
      icon: 'straighten',
      color: '#2196F3'
    },
    {
      title: 'Chirurgie Dentaire',
      description: 'Interventions chirurgicales précises et sûres',
      icon: 'biotech',
      color: '#F44336'
    },
    {
      title: 'Esthétique Dentaire',
      description: 'Blanchiment, facettes et autres traitements esthétiques',
      icon: 'spa',
      color: '#9C27B0'
    },
    {
      title: 'Urgences Dentaires',
      description: 'Service d\'urgence disponible 24/7 pour les situations critiques',
      icon: 'emergency',
      color: '#FF9800'
    },
    {
      title: 'Soins Préventifs',
      description: 'Nettoyage, détartrage et conseils pour une bonne hygiène bucco-dentaire',
      icon: 'health_and_safety',
      color: '#00BCD4'
    }
  ];

  doctors = [
    {
      id: 1,
      name: 'Dr. Sophie Martin',
      specialty: 'Orthodontiste',
      image: 'assets/images/doctor1.jpg',
      rating: 4.8,
      reviews: 127,
      experience: '15 ans d\'expérience'
    },
    {
      id: 2,
      name: 'Dr. Jean Dupont',
      specialty: 'Chirurgien-Dentiste',
      image: 'assets/images/doctor2.jpg',
      rating: 4.9,
      reviews: 203,
      experience: '20 ans d\'expérience'
    },
    {
      id: 3,
      name: 'Dr. Marie Laurent',
      specialty: 'Endodontiste',
      image: 'assets/images/doctor3.jpg',
      rating: 4.7,
      reviews: 156,
      experience: '12 ans d\'expérience'
    },
    {
      id: 4,
      name: 'Dr. Pierre Dubois',
      specialty: 'Parodontiste',
      image: 'assets/images/doctor4.jpg',
      rating: 4.9,
      reviews: 189,
      experience: '18 ans d\'expérience'
    }
  ];

  testimonials = [
    {
      id: 1,
      name: 'Claire Bernard',
      image: 'assets/images/patient1.jpg',
      rating: 5,
      text: 'Une équipe professionnelle et à l\'écoute. Je recommande vivement leurs services.'
    },
    {
      id: 2,
      name: 'Thomas Petit',
      image: 'assets/images/patient2.jpg',
      rating: 5,
      text: 'Excellent service et résultats remarquables. Je suis très satisfait de mon traitement.'
    },
    {
      id: 3,
      name: 'Sophie Moreau',
      image: 'assets/images/patient3.jpg',
      rating: 4,
      text: 'Une clinique moderne avec des équipements de pointe. Le personnel est très accueillant.'
    }
  ];

  features = [
    {
      title: 'Technologie Avancée',
      description: 'Équipements de pointe pour des diagnostics précis et des traitements efficaces',
      icon: 'biotech'
    },
    {
      title: 'Équipe Qualifiée',
      description: 'Professionnels expérimentés et régulièrement formés aux dernières techniques',
      icon: 'groups'
    },
    {
      title: 'Environnement Confortable',
      description: 'Clinique moderne et accueillante pour une expérience agréable',
      icon: 'spa'
    },
    {
      title: 'Prise en Charge',
      description: 'Convention avec la plupart des mutuelles pour une meilleure prise en charge',
      icon: 'health_and_safety'
    }
  ];

  appointmentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.appointmentForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      service: ['', [Validators.required]],
      date: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Can be empty or load other initial data if needed
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  onSubmitAppointment(): void {
    if (this.appointmentForm.valid) {
      console.log('Appointment form submitted:', this.appointmentForm.value);
      this.snackBar.open('Votre rendez-vous a été enregistré avec succès!', 'Fermer', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });
      this.appointmentForm.reset();
    } else {
      this.snackBar.open('Veuillez remplir tous les champs obligatoires.', 'Fermer', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }
}
