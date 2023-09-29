import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  errorMessage = signal('');
  currentUser = signal<null | any>(this.getUserData());
  token = signal(this.getToken());
  isLoggedIn = computed(() => {
    return this.currentUser() && this.token();
  });

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): void {
    this.http
      .post(`${environment.backendUrl}/login`, { email, password })
      .pipe(take(1))
      .subscribe({
        next: (response: any) => {
          this.storeToken(response.token);
          this.storeUserData(response.user);
          this.router.navigateByUrl('');
        },
        error: (error: any) => {
          console.error(error);
          this.errorMessage.set('Invalid username or password');
        },
      });
  }

  logout(): void {
    this.destroyToken();
    this.destroyUserData();
    this.router.navigateByUrl('');
  }

  private storeToken(token: string): void {
    this.token.set(token);
    localStorage.setItem('user_token', token);
  }

  private getToken(): string | null {
    return localStorage.getItem('user_token');
  }

  private storeUserData(userData: any): void {
    this.currentUser.set(userData);
    localStorage.setItem('user_data', JSON.stringify(userData));
  }

  private getUserData(): any | null {
    const userData = localStorage.getItem('user_data');

    if (userData === null) {
      return null;
    }

    return JSON.parse(userData);
  }

  private destroyToken(): void {
    this.token.set(null);
    localStorage.removeItem('user_token');
  }

  private destroyUserData(): void {
    this.currentUser.set(null);
    localStorage.removeItem('user_data');
  }
}
