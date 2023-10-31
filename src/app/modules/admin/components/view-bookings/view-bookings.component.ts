import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-bookings',
  templateUrl: './view-bookings.component.html',
  styleUrls: ['./view-bookings.component.css'],
})
export class ViewBookingsComponent {
  constructor(private router: Router, private db: AngularFireDatabase) {}
  backToAdminInterface() {
    this.router.navigate(['/admin/admin-interface']);
  }

  bookedSeatsByBus: { [busId: string]: any[] } = {};
  busIds: string[] = [];
  seatNo: number = 0;

  ngOnInit(): void {
    this.db
      .list('/Seats')
      .query.once('value')
      .then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const busId = childSnapshot.key;
          if (busId) {
            this.db
              .list(`/Seats/${busId}/lowerDeck`, (ref) =>
                ref.orderByChild('isBooked').equalTo(true)
              )
              .valueChanges()
              .subscribe((lowerDeckSeats: any[]) => {
                this.bookedSeatsByBus[busId] = lowerDeckSeats;
                this.busIds.push(busId);
              });

            this.db
              .list(`/Seats/${busId}/upperDeck`, (ref) =>
                ref.orderByChild('isBooked').equalTo(true)
              )
              .valueChanges()
              .subscribe((upperDeckSeats: any[]) => {
                if (!this.bookedSeatsByBus[busId]) {
                  this.bookedSeatsByBus[busId] = [];
                }
                this.bookedSeatsByBus[busId] = [
                  ...this.bookedSeatsByBus[busId],
                  ...upperDeckSeats,
                ];
                this.busIds.push(busId);
              });
          }
        });
      });
  }

  getBusIds(): string[] {
    return Object.keys(this.bookedSeatsByBus);
  }

  cancelSeat(busId: string, seatId: number, deck: string) {
    if (deck === 'lower') {
      this.seatNo = seatId - 1;
    } else {
      this.seatNo = seatId - 26;
    }

    const seatRef = this.db.object(
      `/Seats/${busId}/${deck + 'Deck'}/${this.seatNo}`
    );

    seatRef.update({
      isBooked: false,
      gender: '',
      passengerName: '',
      passengerAge: 0,
    });

    const updatedSeats = this.bookedSeatsByBus[busId].filter(
      (seat: any) => seat.id !== seatId
    );

    this.bookedSeatsByBus[busId] = updatedSeats;
  }
}
