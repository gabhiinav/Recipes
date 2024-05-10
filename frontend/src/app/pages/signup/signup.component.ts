import { Component, ViewChild, inject } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [HeaderComponent, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  auth = inject(AuthService);
  @ViewChild('signup') signup!: NgForm;
  checksignup() {
    this.auth.signupAuth(this.signup.value);
    this.signup.reset();
  }
}
