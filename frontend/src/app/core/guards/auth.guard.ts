import { inject } from '@angular/core';
import { Router, CanActivateFn, UrlTree } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { firstValueFrom } from 'rxjs';

export const adminGuard: CanActivateFn = async (): Promise<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.authCheckedSignal) {
    await firstValueFrom(authService.checkAuthStatus());
  }

  const isAuth = authService.isAuthenticated();
  const user = authService.user();

  if (!isAuth || !user) {
    return router.createUrlTree(['/auth/login']);
  }

  if (user.role !== 'admin') {
    if (user.role === 'user') {
      return router.createUrlTree(['/user']);
    }
    return router.createUrlTree(['/auth/login']);
  }

  return true;
};

export const userGuard: CanActivateFn = async (): Promise<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.authCheckedSignal) {
    await firstValueFrom(authService.checkAuthStatus());
  }

  const isAuth = authService.isAuthenticated();
  const user = authService.user();

  if (!isAuth || !user) {
    return router.createUrlTree(['/auth/login']);
  }

  if (user.role !== 'user') {
    if (user.role === 'admin') {
      return router.createUrlTree(['/admin']);
    }
    return router.createUrlTree(['/auth/login']);
  }

  return true;
};