import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root',
})
export class BusService {
  constructor(private db: AngularFireDatabase) {}

  // Method to get the list of available buses
  getAvailableBuses() {
    return this.db.list('/Bus Details').valueChanges();
    // return this.buses;
  }

  // Method to get a specific bus by ID
  getBusById(id: string) {
    return this.db.object(`/Bus Details/${id}`).valueChanges();
    // return this.buses.find((bus) => bus.id === id);
  }
}
