import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminInterfaceComponent } from './components/admin-interface/admin-interface.component';
import { ManageBusesComponent } from './components/manage-buses/manage-buses.component';
import { ViewBookingsComponent } from './components/view-bookings/view-bookings.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { ErrorPageComponent } from 'src/app/shared/components/error-page/error-page.component';

const routes: Routes = [
  { path: 'admin-login', component: AdminLoginComponent },
  {
    path: 'admin-interface',
    component: AdminInterfaceComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'manage-buses',
    component: ManageBusesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'view-bookings',
    component: ViewBookingsComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
