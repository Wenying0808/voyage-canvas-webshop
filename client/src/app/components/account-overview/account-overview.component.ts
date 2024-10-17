import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user.interface';
import { catchError, of, Subscription, tap, timer } from 'rxjs';

@Component({
  selector: 'app-account-overview',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="account-overview" *ngIf="!(authService.currentUser | async)">
      <button mat-fab extended (click)="login()">
        <mat-icon>login</mat-icon>
        Log In With Google
      </button>
    </div>
    <div class="account-overview" *ngIf="authService.currentUser | async as user">
      <div class="account-overview-detail">
        <div class="account-overview-detail-header">Name:</div>
        <div class="account-overview-detail-value">{{ user?.name }}</div>
      </div>
      <div class="account-overview-detail">
        <div class="account-overview-detail-header">Email:</div>
        <div class="account-overview-detail-value">{{ user?.email }}</div>
      </div>
      <button mat-fab extended (click)="logout()">
        <mat-icon>logout</mat-icon>
        Log Out
      </button>
    </div>
  `,
  styleUrl: `./account-overview.component.scss`
})
export class AccountOverviewComponent implements OnInit, OnDestroy{

  user: User | null = null;
  private userSubscription: Subscription | null = null;

  constructor(
    public authService: AuthService,
  ){}

  ngOnInit() {
    console.log('AccountOverviewComponent initialized');
    timer(100).subscribe(() => {
      console.log('Calling loadUserData');
      this.loadUserData();
    });
  }

  // properly unsubscribe from our observables when the component is destroyed. This helps prevent memory leaks.
  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  login() {
    this.authService.login();
    /*console.log("log in triggered");*/
  }

  logout() {
    this.authService.logout();
    console.log("log out triggered");
  }

  loadUserData() {
    this.userSubscription = this.authService.getCurrentUser().pipe(
      tap(user => console.log('Current user:', user)),
      catchError(error => {
        if (error.status === 401) {
          console.log('User not authenticated. This may be normal immediately after login.');
          return of(null);
        }
        console.error('Unexpected error in getCurrentUser:', error);
        return of(null);
      })
    ).subscribe({
      next: (user) => {
        this.user = user;
        if (user) {
          console.log('User data loaded successfully:', user);
        } else {
          console.log('No user data available from getCurrentUser');
        }
      },
      error: (error) => {
        console.error("Unexpected error in loadUserData subscription:", error);
      }
    });
  }
}
