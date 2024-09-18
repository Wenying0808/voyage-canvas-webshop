import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AccountOverviewComponent } from '../../components/account-overview/account-overview.component';
import { OrdersOverviewComponent } from '../../components/orders-overview/orders-overview.component';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, SidebarComponent, AccountOverviewComponent, OrdersOverviewComponent],
  template: `
    <div class="account">
      <app-sidebar (tabSelected)="onTabSelected($event)"></app-sidebar>
      <app-account-overview *ngIf="selectedTab === 'account'"></app-account-overview>
      <app-orders-overview *ngIf="selectedTab === 'orders'"></app-orders-overview>
    </div>
  `,
  styleUrl: `./account.component.scss`,
})

export class AccountComponent {
  selectedTab = 'account'; // Default to 'account'

  onTabSelected(tab: string) {
    /*console.log('Selected tab:', tab);*/
    this.selectedTab = tab;
  }
}
