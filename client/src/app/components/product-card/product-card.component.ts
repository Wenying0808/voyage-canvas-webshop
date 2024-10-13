import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../product.interface';
import { BasketService } from '../../basket.service';
import { AuthService } from '../../auth.service';
import { SessionService } from '../../session.service';
import { BasketItem } from '../../basket.interface';


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
              <button class="product-card-subheader-bottom-button" (click)="addToBasket()">
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

  constructor(
    private basketService: BasketService,
    private authService: AuthService,
    private sessionService: SessionService
  ) {}

  addToBasket() {
    const basketItemToAdd: BasketItem = {
      productId: this.product._id,
      quantity: 1,
      price: this.product.price
    };
    this.authService.getCurrentUser().subscribe( user => {
      const basketId = user ? user._id : this.sessionService.getSessionId();
      this.basketService.addItemToBasket(basketId, basketItemToAdd).subscribe(() => {
        console.log('Product added to basket');
        // add notification or update a nasket counter here
      }),
        (error: any) => console.error('Error adding product to basket', error)
    })
  }
}
