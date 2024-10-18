import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../interfaces/product.interface';
import { BasketService } from '../../services/basket.service';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, filter, of, switchMap, tap } from 'rxjs';


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
              <button class="product-card-subheader-bottom-button" (click)="addToBasket()" [disabled]="isAddingToBasket">
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
  isAddingToBasket = false;

  constructor(
    private productService: ProductService,
    private basketService: BasketService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {}

  addToBasket() {
    const productId = this.product._id;
    const item = { productId, quantity: 1 };
    this.isAddingToBasket = true;
    this.authService.currentUser.pipe(
      tap( user => {
          if(!user) {
            this.snackBar.open("Please log in to add items to your basket", 'Close', { duration: 3000 })
          }
        }
      ),
      filter(user => !!user),
      switchMap( user => this.basketService.addToBasket(user._id, item)),
      catchError(error  => {
        console.error('Error adding to basket:', error);
        this.snackBar.open('Failed to add item to basket', 'Close', { duration: 3000 });
        return of(null); // Return null for potential side effects
      }),
      tap(() => {
        this.isAddingToBasket = false,
        this.snackBar.open('Item added to basket', 'Close', { duration: 3000 });
      })
    ).subscribe();
  }
}
