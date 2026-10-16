import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="logo-header">
          <img src="/assets/images/logo.jpeg" onerror="this.onerror=null; this.src='/logo.jpeg'" alt="MaxisTravel" class="login-logo">
          <h2>Panel Administrativo</h2>
          <p>MaxisTravel - Transporte & Turismo</p>
        </div>

        <div *ngIf="errorMessage" class="error-banner">
          ⚠️ {{ errorMessage }}
        </div>

        <form (ngSubmit)="onLogin()" #loginForm="ngForm">
          <div class="form-group">
            <label for="username">Usuario</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              [(ngModel)]="username" 
              required 
              placeholder="Ej. admin"
              class="form-control"
              autocomplete="username">
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              [(ngModel)]="password" 
              required 
              placeholder="••••••••"
              class="form-control"
              autocomplete="current-password">
          </div>

          <button type="submit" [disabled]="loading" class="btn-login">
            <span *ngIf="!loading">Ingresar al Panel →</span>
            <span *ngIf="loading">Iniciando sesión...</span>
          </button>
        </form>

        <div class="login-footer">
          <p>Credenciales de prueba: <strong>admin</strong> / <strong>MaxisTravel2024!</strong></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%);
      padding: 20px;
      font-family: 'DM Sans', sans-serif;
    }

    .login-card {
      width: 100%;
      max-width: 440px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 24px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .logo-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .login-logo {
      width: 90px;
      height: 90px;
      object-fit: cover;
      border-radius: 50%;
      margin-bottom: 16px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      border: 3px solid #C97F6C;
    }

    .logo-header h2 {
      font-family: 'Outfit', sans-serif;
      font-size: 1.75rem;
      font-weight: 700;
      color: #3D2B1F;
      margin: 0 0 6px 0;
    }

    .logo-header p {
      color: #6E5B50;
      font-size: 0.95rem;
      margin: 0;
    }

    .error-banner {
      background: #FEE2E2;
      border: 1px solid #FCA5A5;
      color: #991B1B;
      padding: 12px 16px;
      border-radius: 12px;
      margin-bottom: 20px;
      font-size: 0.9rem;
      text-align: center;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      font-weight: 600;
      color: #3D2B1F;
      margin-bottom: 8px;
      font-size: 0.9rem;
    }

    .form-control {
      width: 100%;
      padding: 14px 18px;
      border: 2px solid #E8D7D0;
      border-radius: 12px;
      font-size: 1rem;
      transition: all 0.3s ease;
      background: #FFF8F5;
      box-sizing: border-box;
    }

    .form-control:focus {
      outline: none;
      border-color: #C97F6C;
      background: #FFFFFF;
      box-shadow: 0 0 0 4px rgba(201, 127, 108, 0.15);
    }

    .btn-login {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #C97F6C 0%, #C26148 100%);
      color: white;
      border: none;
      border-radius: 14px;
      font-family: 'Outfit', sans-serif;
      font-size: 1.1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 8px 20px rgba(201, 127, 108, 0.35);
      margin-top: 10px;
    }

    .btn-login:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(201, 127, 108, 0.5);
    }

    .btn-login:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .login-footer {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #E8D7D0;
      text-align: center;
      font-size: 0.85rem;
      color: #6E5B50;
    }

    .login-footer strong {
      color: #C26148;
    }

    @media (max-width: 480px) {
      .login-container { padding: 16px; }
      .login-card { padding: 28px 20px; border-radius: 20px; }
      .login-logo { width: 75px; height: 75px; }
      .logo-header h2 { font-size: 1.5rem; }
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Por favor ingresa usuario y contraseña.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Credenciales incorrectas. Intenta con admin / MaxisTravel2024!';
      }
    });
  }
}
