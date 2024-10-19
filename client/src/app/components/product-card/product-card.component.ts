import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../interfaces/product.interface';


@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [ MatButtonModule, MatIconModule ],
  template: `
    <div class="product-card">
      <img class="product-card-image" [src]="product.imageUrl" alt="{{product.name}}">
      <div class="product-card-header">
          <div class="product-card-header-name">{{ product.name }}</div>
          <div class="product-card-header-chip">{{ product.country.name }}</div>
      </div>
      <div class="product-card-subheader">
          <div class="product-card-subheader-price">€{{ product.price }}</div>
          <div class="product-card-subheader-bottom">
              <div class="product-card-subheader-bottom-stock">{{ product.stock }}</div>
              <button class="product-card-subheader-bottom-button" (click)="onAddToBasket()" [disabled]="isAddingToBasket">
                  <mat-icon mat-mini-fab>add_shopping_cart</mat-icon>
              </button>
          </div>
      </div>
    </div>
  `,
  styleUrl: `product-card.component.scss`
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() isAddingToBasket = false;
  @Output() addToBasket = new EventEmitter<Product>();
  

  constructor(
  ) {}

  onAddToBasket() {
    this.addToBasket.emit(this.product);
  }
}
