import { Injectable } from '@angular/core';
import { Seat } from '../../shared/models/seat.model';

@Injectable({
  providedIn: 'root',
})
export class SeatService {
  private selectedSeatNumbers: Seat[] = [];

  constructor() {}

  addSelectedSeatNumber(seat: Seat) {
    this.selectedSeatNumbers.push(seat);
    console.log('added', seat.id);
    console.log('selectedSeatNumbers', this.selectedSeatNumbers);
  }

  removeSelectedSeatNumber(seat: Seat) {
    this.selectedSeatNumbers = this.selectedSeatNumbers.filter(
      (Seat) => Seat !== seat
    );
    console.log('removed', seat.id);
    console.log('selectedSeatNumbers', this.selectedSeatNumbers);
  }

  getSelectedSeatNumbers() {
    return this.selectedSeatNumbers;
  }

  clearSelectedSeatsInLocalStorage(): void {
    console.log('inside service');
    this.selectedSeatNumbers = [];
  }
}
