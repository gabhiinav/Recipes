import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  router = inject(Router);
   http = inject(HttpClient);
  baseUrl = environment.domain;
  username: any;
  userId: any;
  isAuthenticated: boolean = false;
  constructor(@Inject(PLATFORM_ID) private platformId: any) {}
  
  checkAuth() {
    return this.http.get(this.baseUrl + '/auth/check', {
      withCredentials: true,
    });
  }

  signupAuth(formData: any) {
    return this.http.post(this.baseUrl + '/auth/signup', formData).subscribe({
      next: (value) => {
        console.log(value);
        this.router.navigate(['/login']);
      },
      error: (error) => console.log(error),
    });
  }

  loginAuth(formData: any) {
    return this.http
      .post(this.baseUrl + '/auth/login', formData, { withCredentials: true })
      .subscribe({
        next: (value) => {
          console.log(value);
          console.log(Object.values(value)[1]);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('username', JSON.stringify(value));
          }
          this.router.navigate(['/']);
        },
        error: (error) => console.log(error),
      });
  }

  signOut() {
    return this.http
      .get(this.baseUrl + '/auth/logout', { withCredentials: true })
      .subscribe({
        next: (value) => {
          console.log(value);
          localStorage.removeItem('username');
          const currentRoute = this.router.url;
          if (currentRoute === '/') {
            window.location.reload();
          } else {
            this.router.navigate(['/']).then(() => window.location.reload());
          }
        },
        error: (error) => console.log(error),
      });
  }
}
