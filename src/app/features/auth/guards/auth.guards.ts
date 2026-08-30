import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authenticatedGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.user() ? true : inject(Router).createUrlTree(['/login']);
};

export const systemAdminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.user()?.isSystemAdmin ? true : router.createUrlTree(['/']);
};

export const institutionRoleGuard = (role: 'manager' | 'secretary'): CanActivateFn => (route) => {
  const institutionId = route.paramMap.get('institutionId');
  const auth = inject(AuthService);
  return institutionId && auth.hasInstitutionRole(institutionId, role)
    ? true
    : inject(Router).createUrlTree(['/']);
};
