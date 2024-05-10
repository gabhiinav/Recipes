import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { AuthService } from '../../auth.service';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  auth = inject(AuthService);
  constructor(@Inject(PLATFORM_ID) private platformId: any) {}
  ngOnInit(): void {
    this.auth.checkAuth().subscribe({
      next: (value) => {
        console.log(value);
        this.auth.isAuthenticated = Object.values(value)[0];
        if (isPlatformBrowser(this.platformId)) {
          this.auth.username = Object.values(
            JSON.parse(localStorage.getItem('username') as string)
          )[2];
          this.auth.userId = Object.values(
            JSON.parse(localStorage.getItem('username') as string)
          )[1];
        }
      },
      error: (error) => {
        console.log(error); 
      },
    });
  }
  logOut() {
    this.auth.signOut();
  }
}
