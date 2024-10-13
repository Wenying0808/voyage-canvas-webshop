import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketProductCardComponent } from '../../components/basket-product-card/basket-product-card.component';
import { Product } from '../../product.interface';
import { Basket, BasketItem } from '../../basket.interface';
import { BasketService } from '../../basket.service';
import { AuthService } from '../../auth.service';
import { SessionService } from '../../session.service';
import { firstValueFrom, Observable, switchMap } from 'rxjs';
import { ProductService } from '../../product.service';


@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [CommonModule, BasketProductCardComponent],
  template: `
    <div class="basket" *ngIf="basketService.basket$() as basket">
      <div class="basket-items-list" *ngFor="let item of basket.items">
        <app-basket-product-card *ngIf="getProductById(item.productId) | async as product"
          [product]="product" 
          [basketItem]="item"
          (quantityChange)="onQuantityChange(item, $event)"
          (removeItem)="onRemoveItem(item)"
        />
      </div>
    <div>
  `,
  styleUrl: `./basket.component.scss`,
})

export class BasketComponent implements OnInit {

  basket$ = {} as WritableSignal<Basket>;
  basketItems$ = {} as WritableSignal<BasketItem>;

  constructor(
    public basketService: BasketService,
    private authService: AuthService,
    private sessionService: SessionService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.fetchBasket();
  }
  private fetchBasket(): void {
    this.authService.getCurrentUser().pipe(
      switchMap(user => {
        const id = user ? user._id : this.sessionService.getSessionId();
        return this.basketService.loadBasket(id);
      })
    ).subscribe();
  }
  
  getProductById(productId: string): Observable<Product> {
    return this.productService.getProduct(productId);  // Return observable
  }

  onQuantityChange(item: BasketItem, newQuantity: number) {
    this.getBasketId().then(id => {
      this.basketService.updateItemQuantity(id, item.productId, newQuantity).subscribe();
    });
    console.log('Quantity changed:', newQuantity);
  }

  onRemoveItem(item: BasketItem) {
    this.getBasketId().then(id => {
      this.basketService.removeItemFromBasket(id, item.productId).subscribe();
    });
    console.log('Item removed');
  }

  private async getBasketId(): Promise<string> {
    const user = await firstValueFrom(this.authService.getCurrentUser());
    return user ? user._id : this.sessionService.getSessionId();
  }
}
