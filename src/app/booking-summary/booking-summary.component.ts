// booking-summary.component.ts
import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { loadStripe } from '@stripe/stripe-js';
import { SeatService } from '../services/seat.service';
import { Seat } from '../shared/seat.model';

@Component({
  selector: 'app-booking-summary',
  templateUrl: './booking-summary.component.html',
  styleUrls: ['./booking-summary.component.css'],
})
export class BookingSummaryComponent {
  userData: any;

  showConfirmationDialog: boolean = false;
  showSuccessMessage: boolean = false;
  x: Seat[] = [];

  upiId: string = '';
  upiIdForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private db: AngularFireDatabase,
    private seatService: SeatService
  ) {
    this.route.paramMap.subscribe((params) => {
      const state = this.router.getCurrentNavigation()?.extras.state;
      if (state && state['userData']) {
        this.userData = state['userData'];
      }
    });
    console.log('Booking', this.userData);

    this.upiIdForm = this.fb.group({
      upiId: [
        '',
        [
          Validators.required,
          Validators.pattern(/[0-9A-Za-z.-]{2,256}@[A-Za-z]{2,64}/),
        ],
      ],
    });
  }

  ngOnInit(): void {
    console.log(this.seatService.getSelectedSeatNumbers());
    console.log('UserData', this.userData);
  }

  confirmAndPay(): void {
    this.showConfirmationDialog = true;
  }

  cancelBooking(): void {
    this.seatService.clearSelectedSeatsInLocalStorage();
    this.router.navigate(['/buses']);
  }

  //gsadgsd

  confirm(): void {
    if (this.upiIdForm.valid) {
      const selectedSeats = this.seatService.getSelectedSeatNumbers();

      if (selectedSeats.length > 0 && this.userData.length > 0) {
        for (let i = 0; i < selectedSeats.length; i++) {
          const seat = selectedSeats[i];
          const passenger = this.userData[i]; // Match passenger to seat

          if (passenger) {
            const seatData = {
              passengerName: passenger.name,
              passengerAge: passenger.age,
              gender: passenger.gender,
              isBooked: true,
            };

            this.updateSeatData(
              seat.busNo,
              seat.deck + 'Deck',
              seat.deck + 'Deck' === 'lowerDeck' ? seat.id - 1 : seat.id - 26,
              seatData
            );
          }
        }
      }

      // Proceed with the payment
      this.showConfirmationDialog = false;
      this.showSuccessMessage = true;

      setTimeout(() => {
        this.seatService.clearSelectedSeatsInLocalStorage();
        this.router.navigate(['/buses']);
      }, 3000);
    }
  }

  cancel(): void {
    this.showConfirmationDialog = false;
  }

  // asfagf

  updateSeatData(
    busNo: string,
    deck: string,
    seatNumber: number,
    newData: any
  ): void {
    // Construct the path to the seat in your database
    const seatPath = `Seats/${busNo}/${deck}/${seatNumber}`;

    console.log('NewData', newData);
    // Use AngularFire to update the seat data
    this.db
      .object(seatPath)
      .update(newData)
      .then(() => {
        console.log('Seat data updated successfully in Firebase.');
      })
      .catch((error) => {
        console.error('Error updating seat data in Firebase:', error);
      });
  }
}
