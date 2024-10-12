import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../product.interface';
import { BasketItem } from '../../basket.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-basket-product-card',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule],
  template: `
    <div class="basket-product-card">
      <img class="basket-product-card-image" [src]="product.imageUrl" alt="{{product.name}}">
      <div class="basket-product-card-info">
        <div class="basket-product-card-info-name">{{ product.name }}</div>
        <div class="basket-product-card-info-country">{{ product.country.name }}</div>
        <div class="basket-product-card-info-price">€{{ product.price }}</div>
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
        <button (click)="onRemove()">
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

  onQuantityChange() {
    this.quantityChange.emit(this.basketItem.quantity)
  }

  onRemove() {
    this.removeItem.emit()
  }
}
