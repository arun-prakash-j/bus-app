import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SeatService } from '../../../../core/services/seat.service';
import { Seat } from '../../../../shared/models/seat.model';

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
  cannotSelect = false;

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
              if (seat.id % 2 === 0) {
                const adjacentSeat = this.findSeat(seat.id - 1);
                if (adjacentSeat && adjacentSeat.gender === 'female') {
                  if (seat) {
                    seat.gender = 'female';
                  }
                }
              }

              if (seat.id % 2 !== 0) {
                const adjacentSeat = this.findSeat(seat.id + 1);
                if (adjacentSeat && adjacentSeat.gender === 'female') {
                  if (seat) {
                    seat.gender = 'female';
                  }
                }
              }
            }
          } else {
            if (seat.id <= 35) {
              if (seat.id % 2 === 0) {
                const adjacentSeat = this.findSeat(seat.id + 1);
                if (adjacentSeat && adjacentSeat.gender === 'female') {
                  if (seat) {
                    seat.gender = 'female';
                  }
                }
              }
              if (seat.id % 2 !== 0) {
                const adjacentSeat = this.findSeat(seat.id - 1);
                if (adjacentSeat && adjacentSeat.gender === 'female') {
                  if (seat) {
                    seat.gender = 'female';
                  }
                }
              }
            }
          }
        } else {
          this.seatService.removeSelectedSeatNumber(seat);
        }
        this.selectedSeatIds = this.seatService.getSelectedSeatNumbers();
        this.calculateTotal();
        this.cannotSelect = false;
      } else {
        this.cannotSelect = true;
        setTimeout(() => {
          this.cannotSelect = false;
        }, 2000);
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

  isAdjacentSeatBooked(seat: Seat, offset: number): boolean {
    if (!seat || !seat.id || !seat.gender) {
      return false;
    }

    const seatsPerColumn = 2;

    const adjacentSeatAbove = seat.id - seatsPerColumn * offset;
    const adjacentSeatBelow = seat.id + seatsPerColumn * offset;

    const isAdjacentAboveFemale =
      this.isSeatBooked(this.findSeat(adjacentSeatAbove)) &&
      this.getSeatGender(adjacentSeatAbove) === 'female';
    const isAdjacentBelowFemale =
      this.isSeatBooked(this.findSeat(adjacentSeatBelow)) &&
      this.getSeatGender(adjacentSeatBelow) === 'female';

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
      '/customer/buses',
      this.selectedBusId,
      'seats',
      'passenger-info',
    ]);
  }

  backToBusesPage(): void {
    this.seatService.clearSelectedSeatsInLocalStorage();
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
}
