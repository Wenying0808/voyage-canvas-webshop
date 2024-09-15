import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-management-product-card',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="management-product-card">
      <div class="management-product-card-info">

      </div>
      <div class="management-product-card-actions">
        <button mat-icon-button aria-label="Edit">
          <mat-icon>edit_square</mat-icon>
        </button>
        <button mat-icon-button aria-label="Delete">
          <mat-icon>delete</mat-icon>
        </button>
      </div>
    </div>
  `,
  styleUrl: `./management-product-card.component.scss`
})

export class ManagementProductCardComponent {

}
