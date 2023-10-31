import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from '../../../../core/services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './customer-login.component.html',
  styleUrls: ['./customer-login.component.css'],
})
export class CustomerLoginComponent implements OnInit {
  isSignedIn = false;
  isSignUp = false;
  showToast = false;
  mailExist = false;
  isPasswordVisible = false;
  loginForm: FormGroup;
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.firebaseService.onAuthStateChanged((user) => {
      this.isSignedIn = !!user;
    });
  }

  initializeForms(): void {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9]+\.[a-z]{2,4}$/),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]{8,20}$/
          ),
        ],
      ],
    });

    this.signupForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9]+\.[a-z]{2,4}$/),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]{8,20}$/
          ),
        ],
      ],
    });
  }

  async onSignin(): Promise<void> {
    console.log('Entering onSignin');
    const { email, password } = this.loginForm.value;

    try {
      console.log('Before sign-in attempt');
      await this.firebaseService.signin(email, password);
      console.log('After sign-in attempt');

      if (this.isSignedIn) {
        this.loginForm.reset();
        console.log('Navigation to /buses');
        this.router.navigate(['/customer/buses']);
      }
    } catch (error: any) {
      console.log('Error in sign-in:', error);
      this.handleAuthenticationError(error, 'auth/invalid-login-credentials');
    }
  }

  async onSignup(): Promise<void> {
    const { email, password } = this.signupForm.value;
    try {
      await this.firebaseService.signup(email, password);
      this.signupForm.reset();
      this.showToast = true;
      this.isSignUp = !this.isSignUp;
    } catch (error: any) {
      this.handleAuthenticationError(error, 'auth/email-already-in-use');
    }
  }

  private handleAuthenticationError(error: any, errorCode: string): void {
    if (error.code === errorCode) {
      this.mailExist = !this.mailExist;
      console.log('Firebase Error Response:', error);
    } else {
      console.error('Firebase error:', error);
    }
  }

  toggleSignMode(): void {
    this.showToast = false;
    this.isSignUp = !this.isSignUp;
    this.loginForm.reset();
    this.signupForm.reset();
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
