import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/institutions/pages/home/home').then(({ Home }) => Home),
  },
  { path: '**', redirectTo: '' },
];
