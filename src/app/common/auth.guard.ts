import {inject} from '@angular/core';
import {Router, CanActivateFn} from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  console.warn('authGuard')
  const authService = inject(AuthService);
  const user = authService.currentUser;
  const router = inject(Router);
  if (user) {
      return true;
  } else {
      router.navigate(['/auth/signin'], { queryParams: { returnUrl: state.url } });
      return false;
  }
};
