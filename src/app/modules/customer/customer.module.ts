import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerLoginComponent } from './components/customer-login/customer-login.component';
import { BusListComponent } from './components/bus-list/bus-list.component';
import { SeatSelectionComponent } from './components/seat-selection/seat-selection.component';
import { PassengerInfoComponent } from './components/passenger-info/passenger-info.component';
import { BookingSummaryComponent } from './components/booking-summary/booking-summary.component';
import { CustomerRoutingModule } from './customer-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    CustomerLoginComponent,
    BusListComponent,
    SeatSelectionComponent,
    PassengerInfoComponent,
    BookingSummaryComponent,
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    ReactiveFormsModule,
    NgbModule,
  ],
})
export class CustomerModule {}
