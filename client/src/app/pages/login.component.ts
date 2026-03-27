import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  mode: 'login' | 'register' = 'login';
  loading = false;
  message = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  switchMode(mode: 'login' | 'register'): void {
    this.mode = mode;
    this.message = '';
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const email = this.form.value.email || '';
    const password = this.form.value.password || '';
    this.loading = true;
    this.message = '';

    if (this.mode === 'register') {
      this.authService.register(email, password).subscribe({
        next: (res) => {
          this.loading = false;
          this.message = `${res.message} Simdi giris yapabilirsin.`;
          this.mode = 'login';
        },
        error: (err) => {
          this.loading = false;
          this.message = err?.error?.message || 'Kayit yapilirken bir hata olustu.';
        }
      });
      return;
    }

    this.authService.login(email, password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.message = err?.error?.message || 'Giris basarisiz.';
      }
    });
  }
}
