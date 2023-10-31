import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';

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
  selector: 'app-bus-list',
  templateUrl: './bus-list.component.html',
  styleUrls: ['./bus-list.component.css'],
})
export class BusListComponent implements OnInit {
  buses: Bus[] = [];
  selectedBusId: string | null = null;

  constructor(private router: Router, private database: AngularFireDatabase) {}

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

  formatCustomTime(time: CustomTime): string {
    const { hour, minute, meridian } = time;
    const hourValue = hour % 12 === 0 ? 12 : hour % 12;
    const formattedHour = hourValue < 10 ? `0${hourValue}` : hourValue;
    const formattedMinute = minute < 10 ? `0${minute}` : minute;

    return `${formattedHour}:${formattedMinute} ${meridian}`;
  }

  viewSeats(busNo: string) {
    this.selectedBusId = busNo;
    this.router.navigate(['/customer/buses', busNo, 'seats']);
  }
}
