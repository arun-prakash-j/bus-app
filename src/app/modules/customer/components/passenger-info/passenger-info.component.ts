import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SeatService } from '../../../../core/services/seat.service';
import { Seat } from '../../../../shared/models/seat.model';

@Component({
  selector: 'app-passenger-info',
  templateUrl: './passenger-info.component.html',
  styleUrls: ['./passenger-info.component.css'],
})
export class PassengerInfoComponent implements OnInit {
  passengerForms: FormGroup[] = [];
  selectedSeats: Seat[] = [];
  userData: any = {};

  showConfirmationDialog: boolean = false;

  formGroup: FormGroup;

  constructor(
    private seatService: SeatService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.selectedSeats = this.seatService.getSelectedSeatNumbers();
    if (this.selectedSeats) {
      this.selectedSeats.forEach((seat) => {
        this.formGroup = this.fb.group({
          name: [
            '',
            [
              Validators.required,
              Validators.minLength(3),
              Validators.pattern(/^[A-Za-z\s]+$/),
            ],
          ],
          age: [
            '',
            [Validators.required, Validators.min(5), Validators.max(125)],
          ],
          gender: [
            seat.gender === 'female' ? 'female' : '',
            Validators.required,
          ],
        });

        if (seat.gender === 'female') {
          this.formGroup.get('gender')?.disable();
        }

        this.passengerForms.push(this.formGroup);
      });
    }
  }

  ngOnInit(): void {}

  areAllDetailsFilled(): boolean {
    return this.passengerForms.every((formGroup) => formGroup.valid);
  }

  backToSeatSelectionPage(): void {
    this.seatService.clearSelectedSeatsInLocalStorage();
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  proceedToPayout(): void {
    if (this.areAllDetailsFilled()) {
      this.showConfirmationDialog = true;
    }
  }

  confirm(): void {
    this.showConfirmationDialog = false;

    const userData = this.selectedSeats.map((seat, i) => {
      return {
        seatId: seat.id,
        name: this.passengerForms[i].get('name')?.value,
        age: this.passengerForms[i].get('age')?.value,
        gender: this.passengerForms[i].get('gender')?.value,
      };
    });

    this.router.navigate(['customer/booking-summary'], {
      state: { userData },
    });
  }

  cancel(): void {
    this.showConfirmationDialog = false;
  }
}
