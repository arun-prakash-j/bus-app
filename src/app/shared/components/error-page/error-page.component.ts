// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { Location } from '@angular/common';

// @Component({
//   selector: 'app-error-page',
//   templateUrl: './error-page.component.html',
//   styleUrls: ['./error-page.component.css'],
// })
// export class ErrorPageComponent implements OnInit {
//   errorMessage: string = 'An error occurred';

//   constructor(private route: ActivatedRoute, private location: Location) {}

//   ngOnInit(): void {
//     this.route.data.subscribe((data) => {
//       if (data['error']) {
//         console.log('ERR', data['error']);
//         this.errorMessage = data['error'];
//         console.log('ERR_MSG', this.errorMessage);
//       }
//     });
//   }

//   goBack() {
//     this.location.back();
//   }
// }

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css'],
})
export class ErrorPageComponent implements OnInit {
  errorMessage: string;

  constructor(private route: ActivatedRoute, private location: Location) {}

  ngOnInit(): void {
    // Subscribe to the route parameters to get the 'error' parameter
    this.route.params.subscribe((params) => {
      const error = params['error'];

      // Based on the 'error' parameter, set the appropriate error message
      switch (error) {
        case 'access-denied':
          this.errorMessage =
            'Access Denied: You are not authorized to access this page.';
          break;
        case 'login-required':
          this.errorMessage =
            'Login Required: Please log in to access this page.';
          break;
        default:
          this.errorMessage =
            'Page Not Found: The requested page does not exist.';
          break;
      }
    });
  }

  // Method to go back in the browser's history
  goBack() {
    this.location.back();
  }
}
