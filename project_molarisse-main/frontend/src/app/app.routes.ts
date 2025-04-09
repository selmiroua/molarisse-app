import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { ActivateAccountComponent } from './auth/activate-account/activate-account.component';
import { PatientDashboardComponent } from './dashboard/patient-dashboard.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { DoctorDashboardComponent } from './dashboard/doctor-dashboard.component';
import { SecretaireDashboardComponent } from './dashboard/secretaire-dashboard.component';
import { LaboDashboardComponent } from './dashboard/labo-dashboard.component';
import { FournisseurDashboardComponent } from './dashboard/fournisseur-dashboard.component';
import { PharmacieDashboardComponent } from './dashboard/pharmacie-dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { DemandeComponent } from './demande/demande.component';
import { DemandeConfirmationComponent } from './demande/demande-confirmation.component';
import { DemandeManagementComponent } from "./demande-management/demande-management.component";
import { LandingComponent } from './landing/landing.component';
import { DoctorSelectionComponent } from './doctor-selection/doctor-selection.component';

export const routes: Routes = [
  {
    path: 'landing',
    component: LandingComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'sign-in',
    component: SignInComponent
  },
  {
    path: 'activate-account',
    component: ActivateAccountComponent
  },
  {
    path: 'select-doctor',
    component: DoctorSelectionComponent,
    canActivate: [AuthGuard],
    data: { role: 'secretaire' }
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard], // Protect the entire dashboard
    children: [
      {
        path: 'admin',
       component: AdminDashboardComponent,
        data: { role: 'admin' },
      },
      {
        path: 'patient',
        component: PatientDashboardComponent,
        data: { role: 'patient' }
      },
      {
        path: 'doctor',
        component: DoctorDashboardComponent,
        data: { role: 'doctor' }
      },
      {
        path: 'secretaire',
        component: SecretaireDashboardComponent,
        data: { role: 'secretaire' }
      },
      {
        path: 'labo',
        component: LaboDashboardComponent,
        data: { role: 'labo' }
      },
      {
        path: 'fournisseur',
        component: FournisseurDashboardComponent,
        data: { role: 'fournisseur' }
      },
      {
        path: 'pharmacie',
        component: PharmacieDashboardComponent,
        data: { role: 'pharmacie' }
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'demande', // Nested under /dashboard
        component: DemandeComponent
      },
      {
        path: 'demande/confirmation',
        component: DemandeConfirmationComponent
      },
      {
        path: 'demande-management',
        component: DemandeManagementComponent
      }
    ]
  },

  {
    path: '',
    redirectTo: '/landing',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/landing'
  }
];
