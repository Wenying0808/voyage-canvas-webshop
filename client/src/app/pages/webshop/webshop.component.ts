import { Component, OnInit, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
    <div class="webshop-product" *ngFor="let product of products$()">
        <app-product-card [product]="product"></app-product-card>
    </div>  
    </div>
  `,
  styleUrl: `./webshop.component.scss`
})

export class WebshopComponent implements OnInit{
  products$ = {} as WritableSignal<Product[]>;

  constructor(private productService: ProductService) {
    
  }

  ngOnInit() {
    this.fetchProducts();
  }
  private fetchProducts(): void {
    this.products$ = this.productService.products$;
    this.productService.getProducts();
  }
}
