import { Routes } from '@angular/router';
import {
  authenticatedGuard,
  institutionRoleGuard,
  systemAdminGuard,
} from './features/auth/guards/auth.guards';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/institutions/pages/home/home').then(({ Home }) => Home),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login').then(({ Login }) => Login),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/pages/register/register').then(({ Register }) => Register),
  },
  {
    path: 'account',
    canActivate: [authenticatedGuard],
    loadComponent: () =>
      import('./features/account/pages/account-shell/account-shell').then(
        ({ AccountShell }) => AccountShell,
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./features/account/pages/account/account').then(({ Account }) => Account),
      },
      {
        path: 'institutions/:institutionId/manage',
        canActivate: [institutionRoleGuard('manager')],
        loadComponent: () =>
          import('./features/institutions/pages/institution-overview/institution-overview').then(
            ({ InstitutionOverview }) => InstitutionOverview,
          ),
      },
      {
        path: 'institutions/:institutionId/analytics',
        canActivate: [institutionRoleGuard('manager')],
        loadComponent: () =>
          import('./features/institutions/pages/analytics/analytics').then(
            ({ Analytics }) => Analytics,
          ),
      },
      {
        path: 'institutions/:institutionId/team',
        canActivate: [institutionRoleGuard('manager')],
        loadComponent: () =>
          import('./features/institutions/pages/institution-management/institution-management').then(
            ({ InstitutionManagement }) => InstitutionManagement,
          ),
      },
      {
        path: 'institutions/:institutionId/registrations',
        canActivate: [institutionRoleGuard('secretary')],
        loadComponent: () =>
          import('./features/registrations/pages/open-registrations/open-registrations').then(
            ({ OpenRegistrations }) => OpenRegistrations,
          ),
      },
      {
        path: 'institutions/:institutionId/registration-editor',
        redirectTo: 'institutions/:institutionId/registrations',
      },
    ],
  },
  {
    path: 'admin/institutions',
    canActivate: [systemAdminGuard],
    loadComponent: () =>
      import('./features/institutions/pages/admin-institutions/admin-institutions').then(
        ({ AdminInstitutions }) => AdminInstitutions,
      ),
  },
  {
    path: 'admin/registration-fields',
    canActivate: [systemAdminGuard],
    loadComponent: () =>
      import('./features/registrations/pages/registration-field-catalog/registration-field-catalog').then(
        ({ RegistrationFieldCatalog }) => RegistrationFieldCatalog,
      ),
  },
  {
    path: 'institutions/:institutionId/analytics',
    redirectTo: 'account/institutions/:institutionId/analytics',
  },
  {
    path: 'institutions/:institutionId/manage',
    redirectTo: 'account/institutions/:institutionId/team',
  },
  {
    path: 'institutions/:institutionId/registration-editor',
    redirectTo: 'account/institutions/:institutionId/registrations',
  },
  {
    path: 'institutions/:institutionId/register',
    loadComponent: () =>
      import('./features/registrations/pages/registration/registration').then(
        ({ Registration }) => Registration,
      ),
  },
  { path: '**', redirectTo: '' },
];
