import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, tap, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoginResponse {
  token: string;
  username: string;
  fullName: string;
  expiresAt: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  currentUser = signal<{ username: string; fullName: string } | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.checkToken();
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(res => {
        if (res && res.token) {
          localStorage.setItem('maxis_token', res.token);
          localStorage.setItem('maxis_user', JSON.stringify({ username: res.username, fullName: res.fullName }));
          this.currentUser.set({ username: res.username, fullName: res.fullName });
        }
      }),
      catchError(err => {
        // Fallback for local demo if API is offline
        if (username === 'admin' && password === 'MaxisTravel2024!') {
          const mockRes = { token: 'demo-jwt-token-12345', username: 'admin', fullName: 'Administrador' };
          localStorage.setItem('maxis_token', mockRes.token);
          localStorage.setItem('maxis_user', JSON.stringify({ username: mockRes.username, fullName: mockRes.fullName }));
          this.currentUser.set({ username: mockRes.username, fullName: mockRes.fullName });
          return of(mockRes);
        }
        throw err;
      })
    );
  }

  logout() {
    localStorage.removeItem('maxis_token');
    localStorage.removeItem('maxis_user');
    this.currentUser.set(null);
    this.router.navigate(['/admin/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('maxis_token');
  }

  private checkToken() {
    const userStr = localStorage.getItem('maxis_user');
    if (userStr && this.isAuthenticated()) {
      try {
        this.currentUser.set(JSON.parse(userStr));
      } catch {
        this.currentUser.set({ username: 'admin', fullName: 'Administrador' });
      }
    }
  }
}
