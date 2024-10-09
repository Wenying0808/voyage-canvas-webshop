import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AccountOverviewComponent } from '../../components/account-overview/account-overview.component';
import { OrdersOverviewComponent } from '../../components/orders-overview/orders-overview.component';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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

export class AccountComponent implements OnInit, OnDestroy {
  selectedTab = 'account'; // Default to 'account'

  private routeSubscription: Subscription | null = null;
  private userSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.routeSubscription = this.route.queryParams.subscribe(params => {
      if (params['loginSuccess'] === 'true') {
        this.userSubscription = this.authService.getCurrentUser().subscribe({
          next: (user) => {
            this.snackBar.open(`Login successful. Hi, ${user?.name}`, 'Close', { duration: 3000 });
          },
          error: (error) => {
            this.snackBar.open('Failed to load user data', 'Close', { duration: 3000 });
          }
        });
      } else if (params['loginSuccess'] === 'false') {
        this.snackBar.open('Login failed', 'Close', { duration: 3000 });
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  onTabSelected(tab: string) {
    /*console.log('Selected tab:', tab);*/
    this.selectedTab = tab;
  }
}
