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
        <button (click)="onRemove(basketItem.productId)">
          <mat-icon mat-mini-fab>delete</mat-icon>
        </button>
      </div>
    </div>
  `,
  styleUrl: `./basket-product-card.component.scss`
})
export class BasketProductCardComponent implements OnInit {
  @Input() productId!: string;
  @Input() basketItem!: BasketItem;
  @Output() quantityChange = new EventEmitter<number>();
  @Output() removeItem = new EventEmitter<void>();

  product$!: Observable<Product> ;
  userId!: string | null;

  constructor(
    private authService: AuthService,
    private basketService: BasketService,
    private productService: ProductService,
  ) {} 

  ngOnInit() {
    this.product$ = this.productService.getProduct(this.productId);
    this.authService.currentUser.subscribe(user => {
      this.userId = user ? user._id : null;
    });
  }

  onQuantityChange() {
    this.quantityChange.emit(this.basketItem.quantity)
  }

  onRemove(productId: string) {
    if(this.userId){
      this.basketService.removeFromBasket(this.userId, productId);
      this.removeItem.emit()
    } else {
      console.error('Error removing basket item: User is not authenticated');
    }
  }
}
