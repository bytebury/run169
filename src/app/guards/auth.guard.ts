import { CanActivateFn } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { inject } from '@angular/core';

export const AuthGuard: CanActivateFn = (): boolean => {
  const authService = inject(AuthenticationService);
  return authService.isLoggedIn();
};
