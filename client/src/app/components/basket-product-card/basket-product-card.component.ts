import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../interfaces/product.interface';
import { BasketItem } from '../../interfaces/basket.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BasketService } from '../../services/basket.service';
import { ProductService } from '../../services/product.service';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-basket-product-card',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule],
  template: `
    <div class="basket-product-card" *ngIf="product$ | async as product">
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
export class BasketProductCardComponent implements OnInit {

  @Input() basketItem!: BasketItem;
  @Output() quantityChange = new EventEmitter<number>();
  @Output() itemRemoved = new EventEmitter<string>();

  product$!: Observable<Product> ;
  userId!: string | null;

  constructor(
    private authService: AuthService,
    private basketService: BasketService,
    private productService: ProductService,
  ) {
  } 

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.userId = user ? user._id : null;
    });
    if (this.basketItem && this.basketItem.productId) {
      this.product$ = this.productService.getProduct(this.basketItem.productId);
    } else {
      console.error('BasketItem or productId is undefined');
    }
  }

  onQuantityChange() {
    if(this.userId && this.basketItem && this.basketItem.productId){
      this.basketService.updateBasketItemQuantity(this.userId, this.basketItem.productId, this.basketItem.quantity).subscribe({
        next: () => {
          console.log('Quantity updated successfully');
          this.quantityChange.emit(this.basketItem.quantity);
        },
        error: (error) => {
          console.error('Error updating basket item quantity:', error);
        }
      });
      
    } else {
      console.error('Error updating basket item quantity: User is not authenticated');
    }
  }

  onRemove() {
    if(this.userId  && this.basketItem && this.basketItem.productId){
      this.basketService.removeFromBasket(this.userId, this.basketItem.productId).subscribe({
        next: () => {
          this.itemRemoved.emit(this.basketItem.productId);
        },
        error: (error) => {
          console.error('Error removing basket item:', error);
        }
      })
    } else {
      console.error('Error removing basket item: User is not authenticated');
    }
  }
}
