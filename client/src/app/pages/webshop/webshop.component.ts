import { Component, OnInit, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductService } from '../../services/product.service';
import { BasketService } from '../../services/basket.service';
import { Product } from '../../interfaces/product.interface';
import { BasketProductCardComponent } from '../../components/basket-product-card/basket-product-card.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { catchError, filter, of, switchMap, tap } from 'rxjs';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-webshop',
  standalone: true,
  imports: [
    ProductCardComponent, 
    CommonModule, 
    BasketProductCardComponent, 
    MatSnackBarModule
  ],
  providers: [ProductService, BasketService],
  template: `
    <div class="webshop" >
      <div class="webshop-product" *ngFor="let product of products$()">
          <app-product-card 
            [product]="product"
            [isAddingToBasket]="isAddingToBasket"
            (addToBasket)="handleAddToBasket($event)"
          >
          </app-product-card>
      </div>  
    </div>
  `,
  styleUrl: `./webshop.component.scss`
})

export class WebshopComponent implements OnInit{

  products$ = {} as WritableSignal<Product[]>;
  isAddingToBasket = false;

  constructor(
    private productService: ProductService, 
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private basketService: BasketService,
  ) {}

  ngOnInit() {
    this.fetchProducts();
  }
  private fetchProducts(): void {
    this.products$ = this.productService.products$;
    this.productService.getProducts();
  }

  handleAddToBasket(product: Product) {
    const productId = product._id;
    const item = { productId, quantity: 1 };
    this.isAddingToBasket = true;

    this.authService.currentUser.pipe(
      tap( user => {
          if(!user) {
            this.openSnackBar("Please log in to add items to your basket");
          }
        }
      ),
      filter(user => !!user),
      switchMap( user => this.basketService.addToBasket(user._id, item)),
      catchError(error  => {
        console.error('Error adding to basket:', error);
        this.openSnackBar('Failed to add item to basket');
        this.isAddingToBasket = false;
        return of(null); // Return null for potential side effects
      }),
      tap(() => {
        this.openSnackBar(`Item (${product.name}) added to basket`);
        this.isAddingToBasket = false;
      })
    ).subscribe();
  }

  private openSnackBar(message: string) {
    this.snackBar.dismiss();
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

}
