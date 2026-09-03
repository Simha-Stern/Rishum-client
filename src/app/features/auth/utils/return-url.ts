import type { ActivatedRoute } from '@angular/router';

const defaultReturnUrl = '/account';

export const getSafeReturnUrl = (route: ActivatedRoute): string => {
  const returnUrl = route.snapshot.queryParamMap.get('returnUrl');
  return returnUrl &&
    returnUrl.startsWith('/') &&
    !returnUrl.startsWith('//') &&
    returnUrl !== '/login' &&
    returnUrl !== '/register'
    ? returnUrl
    : defaultReturnUrl;
};
