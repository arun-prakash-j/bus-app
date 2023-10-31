import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';

interface CustomTime {
  hour: number;
  minute: number;
  meridian: 'AM' | 'PM';
}

interface Bus {
  busId: string;
  busNo: string;
  arriveTime: CustomTime;
  departTime: CustomTime;
  from: string;
  to: string;
  type: string;
}

@Component({
  selector: 'app-manage-buses',
  templateUrl: './manage-buses.component.html',
  styleUrls: ['./manage-buses.component.css'],
})
export class ManageBusesComponent {
  buses: Bus[] = [];
  showEditForm = false;
  busToDelete: Bus | null = null;
  showAddForm = false;
  showDeletePopUp = false;

  formData: Bus = {} as Bus;

  busForm: FormGroup;
  editForm: FormGroup;

  constructor(
    private router: Router,
    private database: AngularFireDatabase,
    private formBuilder: FormBuilder
  ) {
    this.busForm = this.formBuilder.group({
      busNo: ['', Validators.required],
      arriveTime: ['', Validators.required],
      departTime: ['', Validators.required],
      from: ['', Validators.required],
      to: ['', Validators.required],
      type: ['', Validators.required],
    });

    this.editForm = this.formBuilder.group({
      arriveTime: ['', Validators.required],
      departTime: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.database
      .object('/Bus Details')
      .valueChanges()
      .subscribe((buses: any) => {
        if (buses) {
          console.log('BUSES', buses);
          this.buses = Object.keys(buses).map((key) => ({
            busId: key,
            busNo: buses[key]['BusNo'],
            arriveTime: buses[key]['ArriveTime'],
            departTime: buses[key]['DepartTime'],
            from: buses[key]['From'],
            to: buses[key]['To'],
            type: buses[key]['Type'],
          }));
        }
      });
  }

  showEdit(bus: Bus) {
    this.showEditForm = true;
    this.formData = {...bus}
  }

  cancelEdit() {
    this.showEditForm = false;
    this.editForm.reset();
  }

  saveChanges() {
    console.log('FORM DATA', this.formData);
    console.log('EDIT FORM', this.editForm);

    if (this.editForm.invalid) {
      console.log('Invalid form');
      return;
    }

    const arriveTime = this.editForm.value.arriveTime;
    const departTime = this.editForm.value.departTime;

    const arriveMeridian = arriveTime.hour < 12 ? 'AM' : 'PM';
    const departMeridian = departTime.hour < 12 ? 'AM' : 'PM';

    const updatedBusData = {
      ArriveTime: {
        hour: arriveTime.hour,
        minute: arriveTime.minute,
        meridian: arriveMeridian,
      },
      DepartTime: {
        hour: departTime.hour,
        minute: departTime.minute,
        meridian: departMeridian,
      },
    };

    this.database
      .object(`/Bus Details/${this.formData.busId}`)
      .update(updatedBusData)
      .then(() => {
        this.cancelEdit();
        this.editForm.reset();
      })
      .catch((error) => {
        console.error('Error saving changes:', error);
      });
  }

  addBus() {
    console.log('addBus function called');
    console.log('busform value', this.busForm);
    console.log('Form Status: ', this.busForm.status);
    console.log('Form Values: ', this.busForm.value);

    if (this.busForm.invalid) {
      console.log('INVALID');
      return;
    }

    const arriveTime = this.busForm.value.arriveTime;
    const departTime = this.busForm.value.departTime;

    const arriveMeridian = arriveTime.hour < 12 ? 'AM' : 'PM';
    const departMeridian = departTime.hour < 12 ? 'AM' : 'PM';

    const newBusData = {
      BusNo: this.busForm.value.busNo,
      ArriveTime: {
        hour: arriveTime.hour,
        minute: arriveTime.minute,
        meridian: arriveMeridian,
      },
      DepartTime: {
        hour: departTime.hour,
        minute: departTime.minute,
        meridian: departMeridian,
      },
      From: this.busForm.value.from,
      To: this.busForm.value.to,
      Type: this.busForm.value.type,
    };

    const nextKey = this.calculateNextKey();

    console.log('Before database update', newBusData);

    this.database
      .object(`/Bus Details/${nextKey}`)
      .update(newBusData)
      .then(() => {
        console.log('After database update', newBusData);
        this.createSeatLayout(newBusData.BusNo);

        this.showAddForm = false;
        this.busForm.reset();
      })
      .catch((error) => {
        console.error('Error adding bus:', error);
      });
  }

  formatCustomTime(time: CustomTime): string {
    const { hour, minute, meridian } = time;
    const hourValue = hour % 12 === 0 ? 12 : hour % 12;
    const formattedHour = hourValue < 10 ? `0${hourValue}` : hourValue;
    const formattedMinute = minute < 10 ? `0${minute}` : minute;

    return `${formattedHour}:${formattedMinute} ${meridian}`;
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
      this.cancelDelete();
      return;
    }

    const busId = bus.busId;

    this.database
      .object(`/Bus Details/${busId}`)
      .remove()
      .then(() => {
        this.cancelDelete();
        this.buses = this.buses.filter((b) => b.busId !== busId);

        this.database.object(`/Seats/${bus.busNo}`).remove();
      })
      .catch((error) => {
        console.error('Error deleting bus:', error);
        this.cancelDelete();
      });
  }

  calculateNextKey(): number {
    const existingKeys: number[] = this.buses
      .filter((bus) => bus.busId)
      .map((bus) => {
        const numericPart = bus.busId;
        return numericPart ? Number(numericPart) : 0;
      });

    console.log('Existing keys:', existingKeys);
    const maxKey = existingKeys.length > 0 ? Math.max(...existingKeys) : 0;
    console.log('Max key:', maxKey);
    console.log('Next key:', maxKey + 1);
    return maxKey + 1;
  }

  cancelAdd() {
    this.showAddForm = false;
    this.busForm.reset();
  }

  backToAdminInterface() {
    this.router.navigate(['/admin/admin-interface']);
  }

  createSeatLayout(busNo: string) {
    if (!busNo) {
      return;
    }

    const lowerDeckSeats = [];
    const upperDeckSeats = [];

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

    this.database.object(`/Seats/${busNo}`).set(seatLayout);
    console.log('Created seat layout:', seatLayout);
  }
}
