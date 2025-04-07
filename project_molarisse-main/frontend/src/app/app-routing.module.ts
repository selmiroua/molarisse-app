import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemandeManagementComponent } from './demande-management/demande-management.component';

const routes: Routes = [
  { path: 'demande-management', component: DemandeManagementComponent },
  // Add a default route
  { path: '', redirectTo: '/demande-management', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
