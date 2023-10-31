import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  isSignedUp = false;

  constructor(private firebaseAuth: AngularFireAuth) {
    this.firebaseAuth = firebaseAuth;
  }

  async signin(email: string, password: string): Promise<void> {
    await this.firebaseAuth.signInWithEmailAndPassword(email, password);
  }

  async signup(email: string, password: string): Promise<void> {
    await this.firebaseAuth.createUserWithEmailAndPassword(email, password);
    this.isSignedUp = true;
  }

  logout(): void {
    this.firebaseAuth.signOut();
  }

  isAuthenticated(): Observable<boolean> {
    return this.firebaseAuth.authState.pipe(map((user) => !!user));
  }

  onAuthStateChanged(callback: (user: any) => void): void {
    this.firebaseAuth.onAuthStateChanged(callback);
  }
}
