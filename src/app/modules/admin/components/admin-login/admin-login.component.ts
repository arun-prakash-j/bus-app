import { Component, OnInit } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from '../../../../core/services/firebase.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
})
export class AdminLoginComponent implements OnInit {
  isSignedIn = false;
  nonAdmin = false;
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit(): void {
    this.firebaseService.onAuthStateChanged((user) => {
      this.isSignedIn = !!user;
    });

    this.loginForm = this.fb.group({
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
  }

  async onSignin() {
    const { email, password } = this.loginForm.value;

    if (email === 'admin@onebus.in') {
      try {
        await this.firebaseService.signin(email, password);
        if (this.isSignedIn) {
          this.loginForm.reset();
          this.router.navigate(['/admin/admin-interface']);
        }
      } catch (error) {
        if (
          error instanceof FirebaseError &&
          error.code === 'auth/invalid-login-credentials'
        ) {
          this.router.navigate(['/error-page', { error: 'access-denied' }]);
        }
      }
    }
  }
}
