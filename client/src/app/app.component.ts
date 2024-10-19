import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    NavbarComponent,
    MatSnackBarModule
  ],
  template: `
    <main class="main">
      <app-navbar></app-navbar>
      <router-outlet />
    </main>
  `,
  styleUrl: `./app.component.scss`,
})
export class AppComponent {

  title = 'client';
  constructor(
    private httpClient: HttpClient,
  ) {}

}

