import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user.interface';
import { map, Observable, Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-account-overview',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="account-overview" *ngIf="!(isLoggedIn$ | async)">
      <button mat-fab extended (click)="login()">
        <mat-icon>login</mat-icon>
        Log In With Google
      </button>
    </div>
    <div class="account-overview" *ngIf="isLoggedIn$ | async">
      <div class="account-overview-detail">
        <div class="account-overview-detail-header">Name:</div>
        <div class="account-overview-detail-value">{{ (user$ | async)?.name  }}</div>
      </div>
      <div class="account-overview-detail">
        <div class="account-overview-detail-header">Email:</div>
        <div class="account-overview-detail-value">{{(user$ | async)?.email  }}</div>
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
  
  user$: Observable<User | null>;
  isLoggedIn$: Observable<boolean>;
  private userSubscription!: Subscription;

  constructor(
    public authService: AuthService,
  ) {
    this.user$ = this.authService.currentUser.pipe(
      tap(user => console.log('User in AccountOverviewComponent (from currentUser):', user))
    );
    this.isLoggedIn$ = this.authService.isLoggedIn;
  }

  ngOnInit() {
    console.log('AccountOverviewComponent initialized');
    this.user$ = this.authService.getCurrentUser().pipe(
        tap({
            next: user => console.log('User from getCurrentUser:', user),
            error: error => console.error('Error getting current user:', error),
            complete: () => console.log('getCurrentUser observable completed')
        })
    );
    this.userSubscription = this.user$.subscribe();
  }

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
}

