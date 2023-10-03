import { CanActivateFn } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { inject } from '@angular/core';

export const AuthGuard: CanActivateFn = (): boolean => {
  const authService: AuthenticationService = inject(AuthenticationService);
  return authService.isLoggedIn();
};
