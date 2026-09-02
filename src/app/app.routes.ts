import { Routes } from '@angular/router';
import { authenticatedGuard, institutionRoleGuard, systemAdminGuard } from './features/auth/guards/auth.guards';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/institutions/pages/home/home').then(({ Home }) => Home),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login').then(({ Login }) => Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/pages/register/register').then(({ Register }) => Register),
  },
  {
    path: 'account',
    canActivate: [authenticatedGuard],
    loadComponent: () => import('./features/account/pages/account/account').then(({ Account }) => Account),
  },
  {
    path: 'admin/institutions',
    canActivate: [systemAdminGuard],
    loadComponent: () => import('./features/institutions/pages/admin-institutions/admin-institutions').then(({ AdminInstitutions }) => AdminInstitutions),
  },
  {
    path: 'institutions/:institutionId/analytics',
    canActivate: [institutionRoleGuard('manager')],
    loadComponent: () => import('./features/institutions/pages/analytics/analytics').then(({ Analytics }) => Analytics),
  },
  {
    path: 'institutions/:institutionId/manage',
    canActivate: [institutionRoleGuard('manager')],
    loadComponent: () => import('./features/institutions/pages/institution-management/institution-management').then(({ InstitutionManagement }) => InstitutionManagement),
  },
  {
    path: 'institutions/:institutionId/registration-editor',
    canActivate: [institutionRoleGuard('secretary')],
    loadComponent: () => import('./features/registrations/pages/registration-editor/registration-editor').then(({ RegistrationEditor }) => RegistrationEditor),
  },
  {
    path: 'institutions/:institutionId/register',
    loadComponent: () => import('./features/registrations/pages/registration/registration').then(({ Registration }) => Registration),
  },
  { path: '**', redirectTo: '' },
];
