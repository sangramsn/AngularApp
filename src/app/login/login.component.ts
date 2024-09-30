import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [ReactiveFormsModule],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.authService.login(username, password).subscribe({
        next: (res) => {
          console.log('Login response:', res);
          if (res && res.token) {
            localStorage.setItem('token', res.token);
            this.router.navigate(['/user']);
          } else {
            Swal.fire('Invalid login credentials');
          }
        },
        error: (err) => {
          console.error('Login error:', err);
          Swal.fire(
            'Login failed. Please check your credentials and try again.'
          );
          console.error(err);
        },
      });
    } else {
      Swal.fire('Please fill in all required fields.');
    }
  }
}
