import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketProductCardComponent } from '../../components/basket-product-card/basket-product-card.component';
import { Basket, BasketItem } from '../../interfaces/basket.interface';
import { BasketService } from '../../services/basket.service';
import { AuthService } from '../../services/auth.service';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
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
                  (removeItem)="onRemoveItem(user._id, item.productId)"
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
  basket$: Observable<Basket | null>;

  constructor(
    private authService: AuthService,
    private basketService: BasketService,
  ) {
    console.log('BasketComponent constructor called');
    this.isLoggedIn$ = this.authService.isLoggedIn;
    this.user$ = this.authService.currentUser;
    this.basket$ = this.user$.pipe(
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
    );

  }

  ngOnInit() {
    console.log('BasketComponent initialized');
    this.user$.subscribe(user => {
      if (user) {
        console.log('Current user:', user);
        // Do something with the user data
      } else {
        console.log('No user logged in');
        // Handle the case where there's no logged-in user
      }
    });
    this.basket$.subscribe(basket => {
      if (basket) {
        console.log('User basket:', basket);
        // Do something with the basket data
      } else {
        console.log('No basket available');
        // Handle the case where there's no basket
      }
    })
  }

  onRemoveItem(userId: string, productId: string) {
    this.basketService.removeFromBasket(userId, productId).pipe(
      switchMap(() => this.basketService.getBasket(userId))
    ).subscribe({
      next: (updatedBasket) => { this.basket$ = of(updatedBasket) },
      error: (error) => { console.error('Error removing item from basket:', error) }
    });
  }
}
