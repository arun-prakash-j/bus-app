import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SeatService } from '../services/seat.service';
import { Seat } from '../shared/seat.model';

@Component({
  selector: 'app-seat-selection',
  templateUrl: './seat-selection.component.html',
  styleUrls: ['./seat-selection.component.css'],
})
export class SeatSelectionComponent implements OnInit {
  selectedBusId: string = '';
  selectedSeatIds: Seat[] = [];
  totalFare: number = 0;
  lowerDeckSeats: Seat[] = [];
  upperDeckSeats: Seat[] = [];

  noSeatsSelected: boolean = true;

  totalPrice: number = 0;

  constructor(
    private db: AngularFireDatabase,
    private route: ActivatedRoute,
    private router: Router,
    private seatService: SeatService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.selectedBusId = params['busNo'];

      if (this.selectedBusId) {
        const firebasePath = `/Seats/${this.selectedBusId}`;

        this.db
          .object(firebasePath)
          .valueChanges()
          .subscribe((busSeatsData: any) => {
            if (busSeatsData) {
              this.lowerDeckSeats = busSeatsData.lowerDeck;
              this.upperDeckSeats = busSeatsData.upperDeck;
            }
          });
      }
    });
  }

  selectSeat(seat: Seat): void {
    if (!seat.isBooked) {
      if (this.selectedSeatIds.length < 5 || seat.isSelected) {
        seat.isSelected = !seat.isSelected;

        if (seat.isSelected) {
          this.seatService.addSelectedSeatNumber(seat);

          if (seat.deck === 'lower') {
            if (seat.id <= 20) {
              // Check if it's an even or odd seat number
              if (seat.id % 2 === 0) {
                // Find the adjacent seat with an odd number
                const adjacentSeat = this.findSeat(seat.id - 1);
                console.log('adjacent even', adjacentSeat);
                if (adjacentSeat && adjacentSeat.gender === 'female') {
                  if (seat) {
                    seat.gender = 'female';
                  }
                }
              }

              if (seat.id % 2 !== 0) {
                // Find the adjacent seat with an even number
                const adjacentSeat = this.findSeat(seat.id + 1);
                console.log('adjacent odd', adjacentSeat);
                if (adjacentSeat && adjacentSeat.gender === 'female') {
                  if (seat) {
                    seat.gender = 'female';
                  }
                  console.log('passing seat', seat);
                }
              }
            }
          } else {
            console.log('Inside Upper');
            if (seat.id <= 35) {
              // Check if it's an even or odd seat number
              if (seat.id % 2 === 0) {
                // Find the adjacent seat with an odd number
                const adjacentSeat = this.findSeat(seat.id + 1);
                console.log('adjacent even', adjacentSeat);
                if (adjacentSeat && adjacentSeat.gender === 'female') {
                  if (seat) {
                    seat.gender = 'female';
                  }
                }
              }

              if (seat.id % 2 !== 0) {
                // Find the adjacent seat with an even number
                const adjacentSeat = this.findSeat(seat.id - 1);
                console.log('adjacent odd', adjacentSeat);
                if (adjacentSeat && adjacentSeat.gender === 'female') {
                  if (seat) {
                    seat.gender = 'female';
                  }
                  console.log('passing seat', seat);
                }
              }
            }
          }
        } else {
          this.seatService.removeSelectedSeatNumber(seat);
        }

        this.selectedSeatIds = this.seatService.getSelectedSeatNumbers();

        this.calculateTotal();
      } else {
        console.log('Maximum seat limit (5) reached');
      }
    }
    this.noSeatsSelected = this.selectedSeatIds.length === 0;
  }

  calculateTotal(): void {
    this.totalPrice = this.selectedSeatIds.reduce(
      (total, seat) => total + seat.price,
      0
    );
  }

  getSeatColor(seat: Seat): string {
    if (seat.isBooked) {
      return seat.gender === 'male' ? 'lightblue' : 'pink';
    }

    return seat.isSelected ? 'green' : 'white';
  }

  isSeatBooked(seat: Seat | undefined): boolean {
    return seat ? seat.isBooked : false;
  }

  // 1
  // isAdjacentSeatBooked(seat: Seat, offset: number): boolean {
  //   if (!seat || !seat.id) {
  //     return false;
  //   }

  //   // Determine the maximum seat number in a row (e.g., 2 for your example layout)
  //   const seatsPerRow = 2;

  //   // Calculate the row number based on the seat number and seats per row
  //   const currentRow = Math.floor(seat.id / seatsPerRow);

  //   // Calculate adjacent seat numbers in the same row
  //   const adjacentSeatLeft = seat.id - offset;
  //   const adjacentSeatRight = seat.id + offset;

  //   // Check if adjacent seats are booked by females
  //   const isAdjacentLeftFemale =
  //     this.isSeatBooked(this.findSeat(adjacentSeatLeft)) &&
  //     this.getSeatGender(adjacentSeatLeft) === 'female';
  //   const isAdjacentRightFemale =
  //     this.isSeatBooked(this.findSeat(adjacentSeatRight)) &&
  //     this.getSeatGender(adjacentSeatRight) === 'female';

  //   // If the adjacent seats are booked by females, border the seat
  //   if (seat.gender === 'male') {
  //     return isAdjacentLeftFemale || isAdjacentRightFemale;
  //   }

  //   return false;
  // }

  isAdjacentSeatBooked(seat: Seat, offset: number): boolean {
    if (!seat || !seat.id || !seat.gender) {
      return false;
    }

    // Determine the maximum seat number in a column (e.g., 2 for your example layout)
    const seatsPerColumn = 2;

    // Calculate the column number based on the seat number and seats per column
    const currentColumn = seat.id % seatsPerColumn;

    // Calculate adjacent seat numbers in the same column
    const adjacentSeatAbove = seat.id - seatsPerColumn * offset;
    const adjacentSeatBelow = seat.id + seatsPerColumn * offset;

    // Check if adjacent seats are booked by females
    const isAdjacentAboveFemale =
      this.isSeatBooked(this.findSeat(adjacentSeatAbove)) &&
      this.getSeatGender(adjacentSeatAbove) === 'female';
    const isAdjacentBelowFemale =
      this.isSeatBooked(this.findSeat(adjacentSeatBelow)) &&
      this.getSeatGender(adjacentSeatBelow) === 'female';

    // If the adjacent seats in the same column are booked by females, border the seat
    if (
      seat.gender === 'male' &&
      (isAdjacentAboveFemale || isAdjacentBelowFemale)
    ) {
      return true;
    }

    return false;
  }

  getSeatGender(seatId: number): string {
    const seat = this.findSeat(seatId);
    return seat ? seat.gender : '';
  }

  findSeat(seatId: number): Seat | undefined {
    const seat = this.lowerDeckSeats.find((s) => s.id === seatId);

    if (seat) {
      return seat;
    }

    return this.upperDeckSeats.find((s) => s.id === seatId);
  }

  proceedToPassengerInfo() {
    this.router.navigate([
      'buses',
      this.selectedBusId,
      'seats',
      'passenger-info',
    ]);
  }

  backToBusesPage(): void {
    console.log('inside seat selection');
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
}
