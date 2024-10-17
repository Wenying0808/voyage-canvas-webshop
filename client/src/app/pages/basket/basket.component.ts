import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketProductCardComponent } from '../../components/basket-product-card/basket-product-card.component';
import { Basket, BasketItem } from '../../interfaces/basket.interface';
import { BasketService } from '../../services/basket.service';
import { AuthService } from '../../services/auth.service';
import { catchError, map, Observable, of, switchMap } from 'rxjs';


@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [CommonModule, BasketProductCardComponent],
  template: `
    <div class="basket" >
      <ng-container *ngIf="basketState$ | async as state">
        <div *ngIf="!state.isLoggedIn">Please log in to view your basket</div>
        <div class="basket-items-list" *ngIf="state.basket && state.basket.items.length > 0">
          <app-basket-product-card  *ngFor="let item of state.basket.items" [basketItem]="item"/>
        </div>
        <div class="basket-items-placeholder" *ngIf="state.basket && state.basket.items.length == 0">
          {{ state.userName }}, your basket is empty
        </div>
      </ng-container>
      <div class="basket-summary"></div>
    <div>
  `,
  styleUrl: `./basket.component.scss`,
})

export class BasketComponent implements OnInit {

  basketState$!: Observable<{
    isLoggedIn: boolean;
    userName: string | null;
    basket: Basket | null;
  }>;


  constructor(
    private authService: AuthService,
    private basketService: BasketService,
  ) {
  }
  ngOnInit() {
    this.basketState$ = this.authService.currentUser.pipe(
      switchMap(user => {
        if (user) {
          console.log("user found to load basket", user);
          return this.basketService.getBasket(user._id).pipe(
            map(basket => ({
              isLoggedIn: true,
              userName: user.name,
              basket
            }))
          );
        } else {
          return of({
            isLoggedIn: false,
            userName: null,
            basket: null
          });
        }
      }),
      catchError(error => {
        console.error('Error loading basket', error);
        return of({
          isLoggedIn: false,
          userName: null,
          basket: null
        });
      })
    );
  }
}
