import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map } from 'rxjs';

@Component({
  selector: 'app-bus-list',
  templateUrl: './bus-list.component.html',
  styleUrls: ['./bus-list.component.css'],
})
export class BusListComponent implements OnInit {
  buses: any[] = [];
  selectedBusId: string | null = null;

  constructor(private router: Router, private database: AngularFireDatabase) {}

  ngOnInit(): void {
    this.database
      .object('/Bus Details')
      .valueChanges()
      .pipe(map((buses: any) => buses as any[]))
      .subscribe((buses: any[]) => {
        console.log('Fetched buses:', buses);
        this.buses = buses
          .filter((bus) => this.isValidBus(bus))
          .map((bus: any) => {
            return {
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

  viewSeats(busNo: string) {
    this.selectedBusId = busNo;
    this.router.navigate(['/buses', busNo, 'seats']);
  }
}
