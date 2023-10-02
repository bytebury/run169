import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  errorMessage = signal('');
  isLoggedIn = false;

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): void {
    this.http
      .post(`${environment.backendUrl}/login`, { email, password })
      .pipe(take(1))
      .subscribe({
        next: (_response: any) => {
          this.router.navigateByUrl('');
        },
        error: (error: any) => {
          console.error(error);
          this.errorMessage.set('Invalid username or password');
        },
      });
  }

  logout(): void {
    this.http
      .delete(`${environment.backendUrl}/logout`)
      .pipe(take(1))
      .subscribe();
    this.router.navigateByUrl('');
  }
}
