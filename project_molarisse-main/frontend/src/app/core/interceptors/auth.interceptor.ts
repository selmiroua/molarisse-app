import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('[AuthInterceptor] Intercepting request to:', req.url);
  const token = localStorage.getItem('access_token');
  console.log('[AuthInterceptor] Found token:', token ? 'Yes' : 'No');

  // Clone the request with withCredentials set to true
  let clonedReq = req.clone({
    withCredentials: true
  });

  if (token) {
    clonedReq = clonedReq.clone({
      headers: clonedReq.headers.set('Authorization', `Bearer ${token}`)
    });
    console.log('[AuthInterceptor] Added Authorization header:', clonedReq.headers.get('Authorization'));
    console.log('[AuthInterceptor] Final request headers:', clonedReq.headers.keys());
  } else {
    console.log('[AuthInterceptor] No token found, request will be sent without Authorization header');
  }

  return next(clonedReq);
};
