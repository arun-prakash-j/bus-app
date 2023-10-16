import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
})
export class AdminLoginComponent implements OnInit {
  isSignedIn = false;

  loginError: string | null = null;

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  constructor(
    private router: Router,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('user') !== null) this.isSignedIn = true;
    else this.isSignedIn = false;
  }

  async onSignin() {
    const { email, password } = this.loginForm.value;

    if (email === 'admin@onebus.in') {
      await this.firebaseService.signin(email, password);
      if (this.firebaseService.isLoggedIn) {
        this.loginForm.reset();
        this.isSignedIn = true;
        this.router.navigate(['/admin-interface']);
      }
    }
  }
}
