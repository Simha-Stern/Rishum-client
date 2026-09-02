import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/auth.service';

const registrationRedirect = (router: Router, returnUrl: string) =>
  router.createUrlTree(['/register'], { queryParams: { returnUrl } });

export const authenticatedGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const decide = () => auth.user() ? true : registrationRedirect(router, state.url);
  return auth.isRestored() ? decide() : auth.restoreSession().pipe(map(decide));
};

export const systemAdminGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const decide = () => {
    if (!auth.user()) return registrationRedirect(router, state.url);
    return auth.user()?.isSystemAdmin ? true : router.createUrlTree(['/']);
  };
  return auth.isRestored() ? decide() : auth.restoreSession().pipe(map(decide));
};

export const institutionRoleGuard = (role: 'manager' | 'secretary'): CanActivateFn => (route, state) => {
  const institutionId = route.paramMap.get('institutionId');
  const auth = inject(AuthService);
  const router = inject(Router);
  const decide = () => {
    if (!auth.user()) return registrationRedirect(router, state.url);
    return institutionId && auth.hasInstitutionRole(institutionId, role) ? true : router.createUrlTree(['/']);
  };
  return auth.isRestored() ? decide() : auth.restoreSession().pipe(map(decide));
};
