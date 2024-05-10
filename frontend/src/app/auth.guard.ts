import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

export const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.checkAuth().pipe(
    map((value) => {
      const isAuthenticated = Object.values(value)[0];
      console.log('isAuthenticated', isAuthenticated);
      if (isAuthenticated) {
        console.log('user is authenticated.');
        return true;
      } else {
        console.log('user is not authenticated.');
        router.navigate(['/login']);
        return false;
      }
    }),
    catchError(() => {
      console.log('error checking authentication');
      router.navigate(['/login']);
      return of(false);
    })
  );
};
