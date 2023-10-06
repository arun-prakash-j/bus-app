import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-manage-buses',
  templateUrl: './manage-buses.component.html',
  styleUrls: ['./manage-buses.component.css'],
})
export class ManageBusesComponent {
  buses: any[] = [];
  showEditForm = false;
  busToDelete: any;
  showAddForm = false;
  showDeletePopUp = false;
  newBus: any = {};

  formData: any = {};

  constructor(private router: Router, private database: AngularFireDatabase) {}

  ngOnInit(): void {
    this.database
      .object('/Bus Details')
      .valueChanges()
      .subscribe((buses: any) => {
        console.log('Fetched buses:', buses);

        if (buses) {
          this.buses = Object.keys(buses).map((key) => {
            const bus = buses[key];
            return {
              busId: key,
              busNo: bus['BusNo'],
              arriveTime: bus['ArriveTime'],
              departTime: bus['DepartTime'],
              from: bus['From'],
              to: bus['To'],
              minPrice: bus['MinPrice'],
              seatsLeft: bus['SeatsLeft'],
              type: bus['Type'],
            };
          });
        } else {
          console.error('No data found in "Bus Details"');
        }
      });
  }

  isValidBus(bus: any): boolean {
    return (
      bus &&
      typeof bus['BusNo'] === 'string' &&
      typeof bus['ArriveTime'] === 'string' &&
      typeof bus['DepartTime'] === 'string' &&
      typeof bus['From'] === 'string' &&
      typeof bus['To'] === 'string' &&
      typeof bus['MinPrice'] === 'number' &&
      typeof bus['SeatsLeft'] === 'number' &&
      typeof bus['Type'] === 'string'
    );
  }

  showEdit(bus: any) {
    this.showEditForm = true;

    this.formData = { ...bus };
  }

  cancelEdit() {
    this.showEditForm = false;
  }

  saveChanges() {
    if (this.formData && this.formData.busId) {
      const busId = this.formData.busId;

      const updatedBusData = {
        ArriveTime: this.formData.arriveTime,
        DepartTime: this.formData.departTime,
      };

      this.database
        .object(`/Bus Details/${busId}`)
        .update(updatedBusData)
        .then(() => {
          console.log('Bus details updated successfully');
          this.cancelEdit();
        })
        .catch((error) => {
          console.error('Error updating bus details:', error);
        });
    } else {
      console.error('Invalid bus data or busId');
    }
  }

  addBus() {
    // Validate that all required fields are filled
    if (
      !this.newBus.busNo ||
      !this.newBus.arriveTime ||
      !this.newBus.departTime ||
      !this.newBus.from ||
      !this.newBus.to ||
      !this.newBus.minPrice ||
      !this.newBus.seatsLeft ||
      !this.newBus.type
    ) {
      console.error('Please fill in all required fields.');
      return;
    }

    
    const nextKey = this.calculateNextKey();

    
    const newBusData = {
      BusNo: this.newBus.busNo,
      ArriveTime: this.newBus.arriveTime,
      DepartTime: this.newBus.departTime,
      From: this.newBus.from,
      To: this.newBus.to,
      MinPrice: this.newBus.minPrice,
      SeatsLeft: this.newBus.seatsLeft,
      Type: this.newBus.type,
    };

    this.database
      .object(`/Bus Details/${nextKey}`)
      .update(newBusData)
      .then(() => {
        console.log('Bus details added successfully');

        this.createSeatLayout(this.newBus.busNo);

        this.showAddForm = false;
        this.newBus = {};
      })
      .catch((error) => {
        console.error('Error adding bus details:', error);
      });
  }

  showDelete(bus: any) {
    this.busToDelete = bus;
    this.showDeletePopUp = true;
  }

  cancelDelete() {
    this.showDeletePopUp = false;
  }

  deleteBus(bus: any) {
    if (!bus || !bus.busId) {
      console.error('Invalid bus data or busId');
      this.cancelDelete();
      return;
    }

    const busId = bus.busId;

    this.database
      .object(`/Bus Details/${busId}`)
      .remove()
      .then(() => {
        console.log('Bus deleted successfully');
        this.cancelDelete();

        this.buses = this.buses.filter((b) => b.busId !== busId);

        this.database
          .object(`/Seats/${bus.busNo}`)
          .remove()
          .then(() => {
            console.log('Seat layout deleted successfully for bus:', bus.busNo);
          })
          .catch((error) => {
            console.error('Error deleting seat layout:', error);
          });
      })
      .catch((error) => {
        console.error('Error deleting bus:', error);
        this.cancelDelete();
      });
  }

  calculateNextKey(): number {
    const existingKeys: number[] = this.buses
      .filter((bus) => bus['busId'])
      .map((bus) => {
        const numericPart = bus['busId'];
        return numericPart ? Number(numericPart) : 0;
      });

    const maxKey = existingKeys.length > 0 ? Math.max(...existingKeys) : 0;

    return maxKey + 1;
  }

  cancelAdd() {
    this.showAddForm = false;

    this.newBus = {};
  }

  backToAdminInterface() {
    this.router.navigate(['/admin-interface']);
  }

  createSeatLayout(busNo: string) {
    if (!busNo) {
      console.error('Invalid busNo for seat layout creation');
      return;
    }

    const lowerDeckSeats = [];
    const upperDeckSeats = [];

    // Create 20 seater seats for lower deck
    for (let i = 0; i <= 9; i++) {
      if ((i + 1 * (i + 1)) % 2 != 0) {
        lowerDeckSeats.push({
          busNo: busNo,
          deck: 'lower',
          gender: '',
          height: 30,
          id: i + 1 * (i + 1),
          isBooked: false,
          passengerAge: '',
          passengerName: '',
          price: 700,
          type: 'seater',
          width: 30,
          x: 75 + 50 * i,
          y: 70,
        });
      }

      if ((i + 1 * (i + 2)) % 2 == 0) {
        lowerDeckSeats.push({
          busNo: busNo,
          deck: 'lower',
          gender: '',
          height: 30,
          id: i + 1 * (i + 2),
          isBooked: false,
          passengerAge: '',
          passengerName: '',
          price: 700,
          type: 'seater',
          width: 30,
          x: 75 + 50 * i,
          y: 110,
        });
      }
    }

    // Create 5 sleeper seats for the lower deck
    for (let i = 0; i <= 4; i++) {
      lowerDeckSeats.push({
        busNo: busNo,
        deck: 'lower',
        gender: '',
        height: 35,
        id: 21 + i,
        isBooked: false,
        passengerAge: '',
        passengerName: '',
        price: 1200,
        type: 'sleeper',
        width: 75,
        x: 75 + 100 * i,
        y: 220,
      });
    }

    // Create 10 sleeper seats for the upper deck
    for (let i = 0; i <= 4; i++) {
      if ((i * 2 + 26) % 2 == 0) {
        upperDeckSeats.push({
          busNo: busNo,
          deck: 'upper',
          gender: '',
          height: 35,
          id: i * 2 + 26,
          isBooked: false,
          passengerAge: '',
          passengerName: '',
          price: 1100,
          type: 'sleeper',
          width: 75,
          x: 75 + 100 * i,
          y: 70,
        });
      }

      if ((i * 2 + 27) % 2 != 0) {
        upperDeckSeats.push({
          busNo: busNo,
          deck: 'upper',
          gender: '',
          height: 35,
          id: i * 2 + 27,
          isBooked: false,
          passengerAge: '',
          passengerName: '',
          price: 1100,
          type: 'sleeper',
          width: 75,
          x: 75 + 100 * i,
          y: 110,
        });
      }
    }

    // Create 5 sleeper seats for the upper deck
    for (let i = 0; i <= 4; i++) {
      upperDeckSeats.push({
        busNo: busNo,
        deck: 'upper',
        gender: '',
        height: 35,
        id: i + 36,
        isBooked: false,
        passengerAge: '',
        passengerName: '',
        price: 1100,
        type: 'sleeper',
        width: 75,
        x: 75 + 100 * i,
        y: 220,
      });
    }

    const seatLayout = {
      lowerDeck: lowerDeckSeats,
      upperDeck: upperDeckSeats,
    };

    // Update the seat layout in the Firebase Realtime Database
    this.database
      .object(`/Seats/${busNo}`)
      .set(seatLayout)
      .then(() => {
        console.log('Seat layout created successfully for bus:', busNo);
      })
      .catch((error) => {
        console.error('Error creating seat layout:', error);
      });
  }
}
