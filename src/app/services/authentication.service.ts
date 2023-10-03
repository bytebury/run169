import { HttpClient } from '@angular/common/http';
import { Injectable, computed, effect, signal } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  currentUser = signal<{
    id: number;
    runner_id: string;
    first_name: string;
    last_name: string;
    email: string;
  } | null>(null);
  isLoggedIn = computed(() => !!this.currentUser());
  errorMessage = signal('');

  constructor(private http: HttpClient, private router: Router) {
    effect(
      () => {
        const current_user = localStorage.getItem('current_user');

        if (current_user) {
          this.currentUser.set(JSON.parse(current_user));
        }
      },
      { allowSignalWrites: true }
    );
  }

  login(email: string, password: string): void {
    this.http
      .post(`${environment.backendUrl}/login`, { email, password })
      .pipe(take(1))
      .subscribe({
        next: (response: any) => {
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('current_user', JSON.stringify(response.user));
          this.currentUser.set(response.user);
          this.router.navigateByUrl('');
        },
        error: (error: any) => {
          console.error(error);
          this.errorMessage.set('Invalid username or password');
        },
      });
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    this.currentUser.set(null);
    this.router.navigateByUrl('');
  }
}
