import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductService } from '../../product.service';
import { Product } from '../../product.interface';

@Component({
  selector: 'app-webshop',
  standalone: true,
  imports: [NavbarComponent, ProductCardComponent, CommonModule],
  providers: [ProductService],
  template: `
    <div class="webshop" >
    <div class="webshop-product" *ngFor="let product of products">
        <app-product-card [product]="product"></app-product-card>
    </div>  
    </div>
  `,
  styleUrl: `./webshop.component.scss`
})

export class WebshopComponent {
  products: Product[] = [
    {
      name: 'Sunrise in Tuscany Painting',
      description: 'A vibrant oil painting capturing the warm colors of a sunrise over the Tuscan countryside.',
      country: 'Italy',
      price: 129.99,
      stock: 5,
      imageUrls: ['https://via.placeholder.com/300x200?text=Sunrise+Painting']
    }
  ];
}
