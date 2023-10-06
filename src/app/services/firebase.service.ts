import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  isLoggedIn = false;

  constructor(public firebaseAuth: AngularFireAuth) {
    firebaseAuth.authState.subscribe((user) => {
      this.isLoggedIn = !!user;
    });
  }

  async signin(email: string, password: string) {
    await this.firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.isLoggedIn = true;

        localStorage.setItem('isLoggedIn', 'true');
      });
  }

  async signup(email: string, password: string) {
    await this.firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        this.isLoggedIn = true;

        localStorage.setItem('isLoggedIn', 'true');
      });
  }

  logout() {
    this.firebaseAuth.signOut();
    this.isLoggedIn = false;

    localStorage.setItem('isLoggedIn', 'false');
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }
}
