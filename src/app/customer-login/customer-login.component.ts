import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './customer-login.component.html',
  styleUrls: ['./customer-login.component.css'],
})
export class CustomerLoginComponent implements OnInit {
  isSignedIn = false;
  isSignUp = false;

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  signupForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        ),
      ],
    ],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('user') !== null) this.isSignedIn = true;
    else this.isSignedIn = false;
  }
  async onSignin() {
    const { email, password } = this.loginForm.value;

    await this.firebaseService.signin(email, password);
    if (this.firebaseService.isLoggedIn) {
      this.loginForm.reset();
      this.isSignedIn = true;
      this.router.navigate(['/buses']);
    }
  }

  async onSignup() {
    const { email, password } = this.signupForm.value;

    await this.firebaseService.signup(email, password);
    if (this.firebaseService.isLoggedIn) {
      this.signupForm.reset();
      this.isSignedIn = true;
      alert('Sign up successful. Please sign in using your credentials.');
    }
  }

  toggleSignMode() {
    this.isSignUp = !this.isSignUp; // Toggle between sign-in and sign-up modes
  }
}
