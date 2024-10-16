import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SessionService } from './services/session.service';
import { HttpClient } from '@angular/common/http';


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
  constructor(
    private httpClient: HttpClient,
    private sessionService: SessionService
  ) {}

  /*
  async ngOnInit() {
    await this.initilizeSession();
  }

  async initilizeSession() {
    try {
      const sessionId = await this.sessionService.getSessionId();
      console.log("Session ID: ", sessionId);
    } catch (error) {
      console.error("Error initializing session:", error);
    }
  }
    */

}

