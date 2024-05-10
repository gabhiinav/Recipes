import { Component, ViewChild, inject } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HeaderComponent, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  auth = inject(AuthService);
  @ViewChild('login') login!: NgForm;
  checklogin() {
    this.auth.loginAuth(this.login.value);
    this.login.reset();
  }
}
