import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [NavbarComponent],
  template: `
    <div class="basket">
      <p>
        basket works!
      </p>
    <div>
  `,
  styleUrl: `./basket.component.scss`,
})
export class BasketComponent {

}
