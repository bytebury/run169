import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private auth: AuthenticationService,
    private snackbar: MatSnackBar
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('auth_token') ?? '';
    const authReq = request.clone({
      headers: request.headers.set('Authorization', token),
    });

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.auth.logout();
          this.router.navigate(['/login']);
          this.snackbar.open(
            'You need to log in again to do this action',
            'Dismiss'
          );
        }

        return throwError(() => error);
      })
    );
  }
}
