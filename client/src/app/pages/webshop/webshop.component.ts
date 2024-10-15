import { Component, OnInit, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductService } from '../../services/product.service';
import { BasketService } from '../../services/basket.service';
import { Product } from '../../interfaces/product.interface';
import { BasketProductCardComponent } from '../../components/basket-product-card/basket-product-card.component';
import { BasketItem } from '../../interfaces/basket.interface';

@Component({
  selector: 'app-webshop',
  standalone: true,
  imports: [ProductCardComponent, CommonModule, BasketProductCardComponent],
  providers: [ProductService, BasketService],
  template: `
    <div class="webshop" >
      <div class="webshop-product" *ngFor="let product of products$()">
          <app-product-card [product]="product"></app-product-card>
      </div>  
      {{ basketItems$() | json }}
      <div class="basket-items-list" *ngFor="let item of basketItems$()">
        <app-basket-product-card  [basketItem]="item"/>
      </div>
    </div>
  `,
  styleUrl: `./webshop.component.scss`
})

export class WebshopComponent implements OnInit{
  products$ = {} as WritableSignal<Product[]>;
  basketItems$ = {} as WritableSignal<BasketItem[]>;

  constructor(
    private productService: ProductService, 
    private basketService: BasketService
  ) {}

  ngOnInit() {
    this.fetchProducts();
    this.fetchBasket();
  }
  private fetchProducts(): void {
    this.products$ = this.productService.products$;
    this.productService.getProducts();
  }
  private fetchBasket(): void {
    this.basketItems$ = this.basketService.basketItems$;
    this.basketService.getBasketItems();
  }
}
