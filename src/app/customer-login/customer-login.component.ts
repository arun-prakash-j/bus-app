import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  show = false;
  mailExist = false;

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]{8,}$/
        ),
      ],
    ],
  });

  signupForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]{8,}$/
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
    this.firebaseService.isAuthenticated().subscribe((authenticated) => {
      this.isSignedIn = authenticated;
    });
  }

  async onSignin() {
    const { email, password } = this.loginForm.value;

    // await this.firebaseService.signin(email, password);
    // if (this.isSignedIn) {
    //   this.loginForm.reset();
    //   this.router.navigate(['/buses']);
    // }

    try {
      await this.firebaseService.signin(email, password);
      if (this.isSignedIn) {
        this.loginForm.reset();
        this.router.navigate(['/buses']);
      }}
//     } catch (error: any) {
//       if (error.code === 'auth/invalid-login-credentials') {
//         console.error('Firebase error:', error);
//         console.error('Firebase error code:', error.code);
//         console.error('Firebase error message:', error.message);
//         console.log('Email: ' + email);
//         console.log('Password: ' + password);
// alert("Invalid Credentials")
//         this.mailExist = !this.mailExist;
//       }
//     }
    catch  (e:any) {
      alert('Failed with error code: ${e.code}');
      alert(e.message);}
  }

  async onSignup() {
    const { email, password } = this.signupForm.value;
    try {
      await this.firebaseService.signup(email, password);
      this.signupForm.reset();
      this.show = true;
      this.isSignUp = !this.isSignUp;
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        this.mailExist = !this.mailExist;
      }
    }
  }

  toggleSignMode() {
    this.show = false;
    this.isSignUp = !this.isSignUp;
    this.loginForm.reset();
    this.signupForm.reset();
  }
}
