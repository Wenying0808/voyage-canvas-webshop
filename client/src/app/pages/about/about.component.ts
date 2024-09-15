import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [NavbarComponent],
  template: `
    <div class="about">
      <p>
        about works!
      </p>
    </div>
  `,
   styleUrl: `./about.component.scss`
})
export class AboutComponent {

}
