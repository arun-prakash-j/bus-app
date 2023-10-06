import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire/compat';
import { AuthModule, provideAuth, getAuth } from '@angular/fire/auth';

import { AppComponent } from './app.component';
import { CustomerLoginComponent } from './customer-login/customer-login.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminInterfaceComponent } from './admin-interface/admin-interface.component';
import { BusListComponent } from './bus-list/bus-list.component';
import { SeatSelectionComponent } from './seat-selection/seat-selection.component';
import { PassengerInfoComponent } from './passenger-info/passenger-info.component';
import { BookingSummaryComponent } from './booking-summary/booking-summary.component';
import { FirebaseService } from './services/firebase.service';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideDatabase, getDatabase } from '@angular/fire/database';

import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ErrorPageComponent } from './error-page/error-page.component';

import { ViewBookingsComponent } from './view-bookings/view-bookings.component';
import { ManageBusesComponent } from './manage-buses/manage-buses.component';

@NgModule({
  declarations: [
    AppComponent,
    CustomerLoginComponent,
    AdminLoginComponent,
    AdminInterfaceComponent,
    BusListComponent,
    SeatSelectionComponent,
    PassengerInfoComponent,
    BookingSummaryComponent,
    ErrorPageComponent,
    ManageBusesComponent,
    ViewBookingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireModule.initializeApp({
      apiKey: 'AIzaSyB_ijRUsWljOU81y2-YB9tP5I9grfAZVfY',
      authDomain: 'busticketbooking-faf5d.firebaseapp.com',
      projectId: 'busticketbooking-faf5d',
      storageBucket: 'busticketbooking-faf5d.appspot.com',
      messagingSenderId: '240996895446',
      appId: '1:240996895446:web:eff140344c8b1e1dca5777',
    }),
    AngularFireAuthModule,
    AuthModule,
    AngularFireDatabaseModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => {
      const auth = getAuth();
      return auth;
    }),
    provideDatabase(() => getDatabase()),
    BrowserAnimationsModule,
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent],
})
export class AppModule {}
