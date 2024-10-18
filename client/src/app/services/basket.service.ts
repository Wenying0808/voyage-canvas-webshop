import { Injectable, signal, WritableSignal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, BehaviorSubject, map, throwError } from 'rxjs';
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
    return this.httpClient.get<Basket>(`${this.apiUrl}/${userId}`, { withCredentials: true })
      .pipe(
        tap(basket => console.log('Basket fetched:', basket)),
        catchError(error => {
          console.error('Error fetching basket:', error);
          return throwError(() => new Error('Failed to fetch basket'));
        })
      );
  }

  addToBasket(userId: string, item: BasketItem): Observable<any> {
    return this.httpClient.post<string>(`${this.apiUrl}/${userId}/items`, item, { withCredentials: true });
  }

  updateBasketItemQuantity(userId: string, productId: string, quantity: number): Observable<string> {
    return this.httpClient.put<string>(`${this.apiUrl}/${userId}/items/${productId}`, { quantity }, { withCredentials: true });
  }

  removeFromBasket(userId: string, productId: string): Observable<string> {
    return this.httpClient.delete<string>(`${this.apiUrl}/${userId}/items/${productId}`, { withCredentials: true })
    .pipe(
      tap(() => console.log(`Item ${productId} removed from basket for user ${userId}`)),
      catchError(error => {
        console.error('Error removing item from basket:', error);
        return throwError(() => new Error('Failed to remove item from basket'));
      })
    );
  }

}