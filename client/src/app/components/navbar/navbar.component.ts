import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterModule],
  template: `
    <mat-toolbar class="navbar">
      <span class="navbar-logo">Voyage Canvas</span>
      <span class="navbar-spacer"></span>
      <a class="navbar-tab" routerLink="/about" routerLinkActive="active-link" [routerLinkActiveOptions]="{exact: true}">About</a>
      <a class="navbar-tab" routerLink="/webshop-management" routerLinkActive="active-link" [routerLinkActiveOptions]="{exact: true}">Webshop-Management</a>
      <a class="navbar-tab" routerLink="/webshop" routerLinkActive="active-link" [routerLinkActiveOptions]="{exact: true}">Webshop</a>
      <button mat-icon-button class="navbar-tab-button" aria-label="basket" routerLink="/basket" routerLinkActive="active-link" [routerLinkActiveOptions]="{exact: true}">
          <mat-icon>shopping_bag</mat-icon>
      </button>
      <button mat-icon-button class="navbar-tab-button" aria-label="account" routerLink="/account" routerLinkActive="active-link" [routerLinkActiveOptions]="{exact: true}">
          <mat-icon>account_circle</mat-icon>
      </button>
    </mat-toolbar>
  `,
  styleUrl: `./navbar.component.scss`
})

export class NavbarComponent {

}
