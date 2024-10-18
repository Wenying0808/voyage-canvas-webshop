import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketProductCardComponent } from '../../components/basket-product-card/basket-product-card.component';
import { Basket, BasketItem } from '../../interfaces/basket.interface';
import { BasketService } from '../../services/basket.service';
import { AuthService } from '../../services/auth.service';
import { BehaviorSubject, catchError, map, Observable, of, switchMap } from 'rxjs';
import { User } from '../../interfaces/user.interface';


@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [CommonModule, BasketProductCardComponent],
  template: `
    <div class="basket" >
      <ng-container *ngIf="(isLoggedIn$ | async); else loginPrompt">
        <ng-container *ngIf="(user$ | async) as user">
          <ng-container *ngIf="(basket$ | async) as basket">
            <div *ngIf="basket && basket.items && basket.items.length > 0; else emptyBasket">
              <div class="basket-items-list">
                <app-basket-product-card 
                  *ngFor="let item of basket.items" 
                  [basketItem]="item"
                  (itemRemoved)="onItemRemoved($event)"
                  (quantityChange)="onQuantityChanged($event)"
                />
              </div>
              <div class="basket-summary"></div>
            </div>
          </ng-container>
          <ng-template #emptyBasket>
            <div class="basket-placeholder">{{ user.name }}, your basket is empty</div>
          </ng-template>
        </ng-container>
      </ng-container>
      <ng-template #loginPrompt>
        <div class="basket-placeholder">Please login to view your basket</div>
      </ng-template>
    <div>
  `,
  styleUrl: `./basket.component.scss`,
})

export class BasketComponent implements OnInit {
  
  isLoggedIn$: Observable<boolean>;
  user$: Observable<User | null>;
  private basketSubject = new BehaviorSubject<Basket | null>(null);
  basket$ = this.basketSubject.asObservable();

  constructor(
    private authService: AuthService,
    private basketService: BasketService,
  ) {
    console.log('BasketComponent constructor called');
    this.isLoggedIn$ = this.authService.isLoggedIn;
    this.user$ = this.authService.currentUser;
    this.refreshBasket();

  }

  ngOnInit() {
  }

 
  private refreshBasket() {
    console.log('Refresh basket triggered');
    this.user$.pipe(
      switchMap(user => {
        if (user && user._id) {
          return this.basketService.getBasket(user._id).pipe(
            catchError(error => {
              console.error('Error in basket component:', error);
              return of(null);
            })
          );
        } else {
          return of(null);
        }
      })
    ).subscribe(basket => {
      this.basketSubject.next(basket);
    });
  }

  onItemRemoved(productId: string) {
    this.user$.pipe(
      switchMap(user => {
        if (user && user._id) {
          return this.basketService.removeFromBasket(user._id, productId);
        }
        return of(null);
      })
    ).subscribe({
      next: () => {
        console.log('Item removed successfully');
        // The basket$ observable will automatically update
        this.refreshBasket(); // Refresh the basket after item removal
      },
      error: (error) => console.error('Error removing item:', error)
    });
  }

  onQuantityChanged(quantityUpdate: { productId: string, quantity: number }) {
    this.user$.pipe(
      switchMap(user => {
        if (user && user._id) {
          return this.basketService.updateBasketItemQuantity(
            user._id, 
            quantityUpdate.productId, 
            quantityUpdate.quantity
          );
        }
        return of(null);
      })
    ).subscribe({
      next: () => {
        console.log('Quantity updated successfully');
        this.refreshBasket();
      },
      error: (error: any) => console.error('Error updating quantity:', error)
    });
  }
}

