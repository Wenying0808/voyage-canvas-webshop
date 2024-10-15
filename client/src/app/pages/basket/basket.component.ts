import { Component, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketProductCardComponent } from '../../components/basket-product-card/basket-product-card.component';
import { Product } from '../../interfaces/product.interface';
import { Basket, BasketItem } from '../../interfaces/basket.interface';
import { BasketService } from '../../services/basket.service';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';
import { firstValueFrom, Observable, switchMap } from 'rxjs';
import { ProductService } from '../../services/product.service';


@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [CommonModule, BasketProductCardComponent],
  template: `
    <div class="basket" >
      {{ basketItems$() | json }}
      <div class="basket-items-list" *ngFor="let item of basketItems$()">
        <app-basket-product-card  [basketItem]="item"/>
      </div>
    <div>
  `,
  styleUrl: `./basket.component.scss`,
})

export class BasketComponent implements OnInit{
  basketItems$ = {} as WritableSignal<BasketItem[]>;

  constructor(
    private basketService: BasketService,
  ) {
  }
  ngOnInit() {
    this.basketItems$ = this.basketService.basketItems$;
    this.basketService.getBasketItems();
    console.log("loaded basketItems:",this.basketItems$())
  }

}
