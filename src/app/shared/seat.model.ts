import { FormControl, FormGroup, Validators } from '@angular/forms';

export class Seat {
  id: number;
  deck: string;
  type: string;
  isBooked: boolean;
  gender: string;
  isSelected?: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  price: number;
  passengerName: string;
  passengerAge: number;
  busNo: string;
  passengerForm: FormGroup;

  constructor(
    id: number,
    deck: string,
    type: string,
    isBooked: boolean,
    gender: string,
    busNo: string
  ) {
    this.id = id;
    this.deck = deck;
    this.type = type;
    this.isBooked = isBooked;
    this.gender = gender;
    this.isSelected = false;
    this.busNo = busNo;
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.price = 0;
    this.passengerName = '';
    this.passengerAge = 0;
    this.passengerForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[A-Za-z\s]+$/),
      ]),
      age: new FormControl('', [Validators.required, Validators.min(5)]),
      gender: new FormControl('', Validators.required),
    });
  }
}
