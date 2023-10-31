import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerLoginComponent } from './components/customer-login/customer-login.component';
import { BusListComponent } from './components/bus-list/bus-list.component';
import { SeatSelectionComponent } from './components/seat-selection/seat-selection.component';
import { PassengerInfoComponent } from './components/passenger-info/passenger-info.component';
import { BookingSummaryComponent } from './components/booking-summary/booking-summary.component';
import { AuthGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  { path: 'customer-login', component: CustomerLoginComponent },
  {
    path: 'buses/:busNo/seats/passenger-info',
    component: PassengerInfoComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'buses/:busNo/seats',
    component: SeatSelectionComponent,
    canActivate: [AuthGuard],
  },
  { path: 'buses', component: BusListComponent, canActivate: [AuthGuard] },
  {
    path: 'booking-summary',
    component: BookingSummaryComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
