import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ToursComponent } from './pages/tours/tours.component';
import { TourDetailComponent } from './pages/tour-detail/tour-detail.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { LoginComponent } from './admin/login/login.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { TourManagementComponent } from './admin/tour-management/tour-management.component';
import { GalleryManagementComponent } from './admin/gallery-management/gallery-management.component';
import { PaletteSelectorComponent } from './admin/settings/palette-selector/palette-selector.component';
import { ChangePasswordComponent } from './admin/settings/change-password/change-password.component';
import { MessagesComponent } from './admin/messages/messages.component';
import { BookingsComponent } from './admin/bookings/bookings.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'tours', component: ToursComponent },
  { path: 'tours/:slug', component: TourDetailComponent },
  { path: 'nosotros', component: AboutComponent },
  { path: 'contacto', component: ContactComponent },
  { path: 'admin/login', component: LoginComponent },
  { 
    path: 'admin', 
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'reservas', component: BookingsComponent },
      { path: 'tours', component: TourManagementComponent },
      { path: 'mensajes', component: MessagesComponent },
      { path: 'galeria', component: GalleryManagementComponent },
      { path: 'paleta', component: PaletteSelectorComponent },
      { path: 'password', component: ChangePasswordComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
