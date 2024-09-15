import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
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
}

