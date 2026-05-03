import { Component, signal, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  imports: [FormsModule, CommonModule],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loading = signal<boolean>(false);
  error = signal<string>('');
  showPassword = signal<boolean>(false);
  authService = inject(AuthService);
  router = inject(Router);

  onSubmit() {
    this.loading.set(true);
    this.error.set('');

    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        
        const role = response.user?.role;
        
        if (role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/user']);
        }
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error de conexión con el servidor');
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }
}
