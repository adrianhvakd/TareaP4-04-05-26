import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
})
export class LoginComponent {
  protected readonly title = signal('frontend');
}
