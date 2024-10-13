import { Injectable, signal, computed, effect, WritableSignal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { Basket, BasketItem } from './basket.interface';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private apiUrl = 'http://localhost:5200/baskets';
  private basketSignal: WritableSignal<Basket> = signal({} as Basket);

  // Public signals
  readonly basket$: Signal<Basket> = this.basketSignal.asReadonly();
  readonly totalItems$: Signal<number> = computed(() => 
    this.basketSignal().items?.reduce((total, item) => total + item.quantity, 0) || 0
  );
  readonly totalPrice$: Signal<number> = computed(() => 
    this.basketSignal().items?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0
  );

  constructor(private http: HttpClient) {
  }

  loadBasket(id: string): Observable<Basket> {
    return this.getBasket(id).pipe(
      tap(basket => this.basketSignal.set(basket)),
      catchError(error => {
        console.error('Error loading basket', error);
        return of({} as Basket);
      })
    );
  }

  addItemToBasket(id: string, item: BasketItem): Observable<Basket> {
    return this.http.post<Basket>(`${this.apiUrl}/${id}/items`, item).pipe(
      tap(updatedBasket => this.basketSignal.set(updatedBasket))
    );
  }

  updateItemQuantity(id: string, productId: string, quantity: number): Observable<Basket> {
    return this.http.put<Basket>(`${this.apiUrl}/${id}/items/${productId}`, { quantity }).pipe(
      tap(updatedBasket => this.basketSignal.set(updatedBasket))
    );
  }

  removeItemFromBasket(id: string, productId: string): Observable<Basket> {
    return this.http.delete<Basket>(`${this.apiUrl}/${id}/items/${productId}`).pipe(
      tap(updatedBasket => this.basketSignal.set(updatedBasket))
    );
  }

  clearBasket(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.basketSignal.set({} as Basket))
    );
  }

  private getBasket(id: string): Observable<Basket> {
    return this.http.get<Basket>(`${this.apiUrl}/${id}`);
  }

  private createOrUpdateBasket(basket: Basket): Observable<Basket> {
    return this.http.post<Basket>(`${this.apiUrl}`, basket);
  }
}