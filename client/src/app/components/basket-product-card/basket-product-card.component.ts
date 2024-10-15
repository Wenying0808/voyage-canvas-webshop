import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../interfaces/product.interface';
import { BasketItem } from '../../interfaces/basket.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BasketService } from '../../services/basket.service';


@Component({
  selector: 'app-basket-product-card',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule],
  template: `
    <div class="basket-product-card">
      <img class="basket-product-card-image" [src]="basketItem.product.imageUrl" alt="{{basketItem.product.name}}">
      <div class="basket-product-card-info">
        <div class="basket-product-card-info-name">{{ basketItem.product.name }}</div>
        <div class="basket-product-card-info-country">{{ basketItem.product.country.name }}</div>
        <div class="basket-product-card-info-price">€{{ basketItem.product.price }}</div>
      </div>
      <div class="basket-product-card-controls">
        <input 
          class="basket-product-card-controls-quantity"
          type="number" 
          name="quantity"
          min=1
          [(ngModel)]="basketItem.quantity" 
          (ngModelChange)="onQuantityChange()"
        >
        <button (click)="onRemove(basketItem.product)">
          <mat-icon mat-mini-fab>delete</mat-icon>
        </button>
      </div>
    </div>
  `,
  styleUrl: `./basket-product-card.component.scss`
})
export class BasketProductCardComponent {
  @Input() product!: Product;
  @Input() basketItem!: BasketItem;
  @Output() quantityChange = new EventEmitter<number>();
  @Output() removeItem = new EventEmitter<void>();

  constructor(private basketService: BasketService) {} 
  
  onQuantityChange() {
    this.quantityChange.emit(this.basketItem.quantity)
  }

  onRemove(product: Product) {
    this.basketService.removeItemFromBasket(product);
    this.removeItem.emit()
  }
}
