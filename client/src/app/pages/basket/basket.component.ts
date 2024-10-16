import { Component, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketProductCardComponent } from '../../components/basket-product-card/basket-product-card.component';
import { Product } from '../../interfaces/product.interface';
import { Basket, BasketItem } from '../../interfaces/basket.interface';
import { BasketService } from '../../services/basket.service';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';
import { catchError, firstValueFrom, Observable, of, switchMap } from 'rxjs';
import { ProductService } from '../../services/product.service';


@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [CommonModule, BasketProductCardComponent],
  template: `
    <div class="basket" >
      <div class="basket-items-list" *ngIf="basket$ | async as basket">
        <app-basket-product-card  *ngFor="let item of basket.items" [basketItem]="item"/>
      </div>
    <div>
  `,
  styleUrl: `./basket.component.scss`,
})

export class BasketComponent implements OnInit{

  basket$: Observable<Basket | null> = of(null);

  constructor(
    private authService: AuthService,
    private basketService: BasketService,
  ) {
  }
  ngOnInit() {
    this.basket$ = this.authService.currentUser.pipe(
      switchMap(user => {
        if (user) {
          console.log("user found to load basket", user);
          return this.basketService.getBasket(user._id);
        } else {
          return of(null);
        }
      }),
      catchError(error => {
        console.error('Error loading basket', error);
        return of(null);
      })
    );
  }
}
