import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-page-container">
      <div class="admin-page-header">
        <div>
          <h2>🔑 Cambiar Contraseña</h2>
          <p class="subtitle">Actualiza la contraseña de acceso al panel de administración.</p>
        </div>
      </div>

      <div class="password-card">
        <div *ngIf="successMessage" class="alert alert-success">
          ✅ {{ successMessage }}
        </div>
        <div *ngIf="errorMessage" class="alert alert-error">
          ⚠️ {{ errorMessage }}
        </div>

        <form (ngSubmit)="onChangePassword()" #pwForm="ngForm">
          <div class="form-group">
            <label>Contraseña Actual *</label>
            <input 
              type="password" 
              [(ngModel)]="currentPassword" 
              name="currentPassword" 
              required 
              placeholder="••••••••"
              class="form-input">
          </div>

          <div class="form-group">
            <label>Nueva Contraseña *</label>
            <input 
              type="password" 
              [(ngModel)]="newPassword" 
              name="newPassword" 
              required 
              minlength="6"
              placeholder="Mínimo 6 caracteres"
              class="form-input">
          </div>

          <div class="form-group">
            <label>Confirmar Nueva Contraseña *</label>
            <input 
              type="password" 
              [(ngModel)]="confirmPassword" 
              name="confirmPassword" 
              required 
              placeholder="Repite la nueva contraseña"
              class="form-input">
          </div>

          <button type="submit" [disabled]="!pwForm.form.valid" class="btn btn-primary mt-4">
            Actualizar Contraseña
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .admin-page-container {
      padding: 30px;
      font-family: 'DM Sans', sans-serif;
    }

    .admin-page-header {
      margin-bottom: 24px;
    }

    .admin-page-header h2 {
      font-family: 'Outfit', sans-serif;
      font-size: 1.8rem;
      color: #1A1A2E;
      margin: 0 0 6px 0;
    }

    .subtitle {
      color: #64748B;
      font-size: 0.95rem;
      margin: 0;
    }

    .password-card {
      max-width: 500px;
      background: #FFFFFF;
      border-radius: 20px;
      padding: 32px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      border: 1px solid #E2E8F0;
    }

    .alert {
      padding: 12px 16px;
      border-radius: 12px;
      margin-bottom: 20px;
      font-size: 0.9rem;
    }
    .alert-success { background: #DCFCE7; border: 1px solid #86EFAC; color: #166534; }
    .alert-error { background: #FEE2E2; border: 1px solid #FCA5A5; color: #991B1B; }

    .form-group {
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      font-weight: 600;
      font-size: 0.85rem;
      color: #475569;
      margin-bottom: 8px;
    }

    .form-input {
      padding: 12px 16px;
      border: 1px solid #CBD5E1;
      border-radius: 12px;
      font-size: 0.95rem;
      background: #F8FAFC;
    }

    .form-input:focus {
      outline: none;
      border-color: #C97F6C;
      background: #FFFFFF;
    }

    .btn-primary {
      background: linear-gradient(135deg, #C97F6C 0%, #C26148 100%);
      color: white;
      border: none;
      padding: 14px 24px;
      border-radius: 12px;
      font-weight: 700;
      cursor: pointer;
      width: 100%;
      box-shadow: 0 4px 14px rgba(201, 127, 108, 0.3);
    }
  `]
})
export class ChangePasswordComponent {
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  successMessage = '';
  errorMessage = '';
  isSubmitting = false;

  constructor(private authService: AuthService) {}

  onChangePassword() {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'La nueva contraseña y la confirmación no coinciden.';
      return;
    }

    if (this.newPassword.length < 6) {
      this.errorMessage = 'La nueva contraseña debe tener al menos 6 caracteres.';
      return;
    }

    this.isSubmitting = true;
    this.authService.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.successMessage = res?.message || '¡Contraseña de administración actualizada correctamente en la base de datos!';
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: (err) => {
        this.isSubmitting = false;
        const msg = err.error?.message || 'Error al actualizar contraseña. Verifica que la contraseña actual sea la correcta.';
        this.errorMessage = msg;
      }
    });
  }
}

