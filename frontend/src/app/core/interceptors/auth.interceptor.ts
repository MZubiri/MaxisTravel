import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('maxis_token');

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // If 401 Unauthorized on admin endpoint, clear token and redirect to login
      if (error.status === 401 && req.url.includes('/admin/')) {
        localStorage.removeItem('maxis_token');
        localStorage.removeItem('maxis_user');
        router.navigate(['/admin/login']);
      }
      return throwError(() => error);
    })
  );
};
