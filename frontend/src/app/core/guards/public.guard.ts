import { CanActivateFn, Router, UrlTree } from "@angular/router";
import { AuthService } from "../../auth/auth.service";
import { inject } from "@angular/core";
import { firstValueFrom } from "rxjs";

export const publicGuard: CanActivateFn = async (): Promise<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.authCheckedSignal) {
    await firstValueFrom(authService.checkAuthStatus());
  }

  const isAuth = authService.isAuthenticated();
  const user = authService.user();

  if (isAuth && user) {
    return user.role === 'admin'
      ? router.createUrlTree(['/admin'])
      : router.createUrlTree(['/user']);
  }

  return true;
};