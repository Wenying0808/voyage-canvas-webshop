import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [NavbarComponent],
  template: `
    <div class="account">
      <p>
        account works!
      </p>
    <div>
  `,
  styleUrl: `./account.component.scss`,
})
export class AccountComponent {

}
