import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminInterfaceComponent } from './components/admin-interface/admin-interface.component';
import { ManageBusesComponent } from './components/manage-buses/manage-buses.component';
import { ViewBookingsComponent } from './components/view-bookings/view-bookings.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';

@NgModule({
  declarations: [
    AdminLoginComponent,
    AdminInterfaceComponent,
    ManageBusesComponent,
    ViewBookingsComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
  ],
})
export class AdminModule {}
