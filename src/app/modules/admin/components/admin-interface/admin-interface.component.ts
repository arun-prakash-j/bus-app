import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-interface',
  templateUrl: './admin-interface.component.html',
  styleUrls: ['./admin-interface.component.css'],
})
export class AdminInterfaceComponent {
  constructor(private router: Router) {}

  manageBuses() {
    this.router.navigate(['/admin/manage-buses']);
  }
  viewBookings() {
    this.router.navigate(['/admin/view-bookings']);
  }
}
