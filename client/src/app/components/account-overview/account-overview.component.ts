import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-account-overview',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="account-overview loggedOut">
      <button mat-fab extended>
        <mat-icon>login</mat-icon>
        Log In
      </button>
    </div>
    <div class="account-overview loggedIn">
      <div class="account-overview-detail">
        <div class="account-overview-detail-header">Name:</div>
        <div class="account-overview-detail-value"></div>
      </div>
      <div class="account-overview-detail">
        <div class="account-overview-detail-header">Email:</div>
        <div class="account-overview-detail-value"></div>
      </div>
      <button mat-fab extended>
        <mat-icon>logout</mat-icon>
        Log Out
      </button>
    </div>
  `,
  styleUrl: `./account-overview.component.scss`
})
export class AccountOverviewComponent {

}
