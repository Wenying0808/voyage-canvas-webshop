import { Injectable, signal, WritableSignal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, BehaviorSubject, map } from 'rxjs';
import { Basket, BasketItem } from '../interfaces/basket.interface';
import { Product } from '../interfaces/product.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private apiUrl = 'http://localhost:5200/baskets';
 
  basketItems$: WritableSignal<BasketItem[]> = signal<BasketItem[]>([]);
  
  constructor(
    private httpClient: HttpClient,
  ) {}

  createBasket(userId: string): Observable<{ message: string; basketId: string }> {
    return this.httpClient.post<{ message: string; basketId: string }>(`${this.apiUrl}`, { userId });
  }

  getBasket(userId: string){
    return this.httpClient.get<Basket>(`${this.apiUrl}/${userId}`);
  }

  addToBasket(userId: string, item: BasketItem): Observable<any> {
    return this.httpClient.post<string>(`${this.apiUrl}/${userId}/items`, item);
  }

  updateBasketItemQuantity(userId: string, productId: string, quantity: number): Observable<string> {
    return this.httpClient.put<string>(`${this.apiUrl}/${userId}/items/${productId}`, { quantity });
  }

  removeFromBasket(userId: string, productId: string): Observable<string> {
    return this.httpClient.delete<string>(`${this.apiUrl}/${userId}/items/${productId}`);
  }

  /* Below is outdated 
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
    */
}