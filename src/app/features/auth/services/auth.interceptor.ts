import { HttpInterceptorFn } from '@angular/common/http';

const tokenStorageKey = 'rishum_plus_session_token';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = localStorage.getItem(tokenStorageKey);
  return next(
    token ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : request,
  );
};
