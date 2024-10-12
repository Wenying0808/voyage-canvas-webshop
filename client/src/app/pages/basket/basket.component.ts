import { Component } from '@angular/core';
import { BasketProductCardComponent } from '../../components/basket-product-card/basket-product-card.component';
import { Product } from '../../product.interface';
import { BasketItem } from '../../basket.interface';


@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [BasketProductCardComponent],
  template: `
    <div class="basket">
      <app-basket-product-card 
      [product]="sampleProduct" 
      [basketItem]="sampleBasketItem"
      (quantityChange)="onQuantityChange($event)"
      (removeItem)="onRemoveItem()"
      />
    <div>
  `,
  styleUrl: `./basket.component.scss`,
})

export class BasketComponent {
  sampleProduct: Product = {
    _id: '1',
    name: 'Organic Bananas',
    description: 'Fresh organic bananas from Ecuador',
    country: {
      code: 'EC',
      name: 'Ecuador'
    },
    price: 1.99,
    stock: 100,
    imageUrl: 'https://via.placeholder.com/300x200?text=Organic+Banana'
  };

  sampleBasketItem: BasketItem = {
    productId: '1',
    quantity: 3,
    price: 1.99
  };

  onQuantityChange(newQuantity: number) {
    console.log('Quantity changed:', newQuantity);
    // Here you would typically update your basket state
  }

  onRemoveItem() {
    console.log('Item removed');
    // Here you would typically remove the item from your basket
  }
}
