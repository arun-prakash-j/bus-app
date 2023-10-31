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
  busNo: string;

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
  }
}
