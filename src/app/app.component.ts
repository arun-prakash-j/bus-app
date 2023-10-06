import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from './services/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'One Bus';
  @Output() isLogout = new EventEmitter<void>();

  constructor(
    private router: Router,
    private firebaseService: FirebaseService
  ) {}

  isLoginPage(): boolean {
    return (
      this.router.url === '/customer-login' ||
      this.router.url === '/admin-login'
    );
  }

  logout() {
    this.firebaseService.logout();
    this.isLogout.emit();
  }
}
