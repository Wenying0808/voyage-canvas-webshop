import { Injectable, signal, computed, effect, WritableSignal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, BehaviorSubject, map } from 'rxjs';
import { Basket, BasketItem } from '../interfaces/basket.interface';
import { SessionService } from './session.service';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private apiUrl = 'http://localhost:5200/baskets';
  /*private basketItems: BasketItem[] = [];*/
  basketItems$: WritableSignal<BasketItem[]> = signal<BasketItem[]>([]);
  
  constructor() {}

  addItemToBasket(product: Product) {
    const newItem: BasketItem = {product: product, quantity: 1};
    this.basketItems$.update( items => {
      return [...items, newItem]
      }
    );
    console.log ("add to basket service is triggered", product);
    console.log("updated basketItems", this.basketItems$());
  }

  getBasketItems(): Signal<BasketItem[]>{
    return this.basketItems$;
  }

  removeItemFromBasket(product: Product){
    const productId = product._id;
    this.basketItems$.update( items => items.filter(item => item.product._id !== productId));
    console.log("Product removed from basket", product);
    console.log("Updated basketItems after removal", this.basketItems$());
  }
}