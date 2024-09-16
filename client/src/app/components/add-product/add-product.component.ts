import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductFormComponent } from '../product-form/product-form.component';
import { Product } from '../../product.interface';
import { ProductService } from '../../product.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ProductFormComponent, MatCardModule],
  template: `
    <p>
    <mat-card>
      <mat-card-header>
        <mat-card-title>Add a New Product</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <app-product-form
          (formSubmitted)="addProduct($event)"
        ></app-product-form>
      </mat-card-content>
    </mat-card>
    </p>
  `,
  styles: ``
})
export class AddProductComponent {
  constructor(
    private router: Router,
    private productService: ProductService
  ) {}

  addProduct(product: Product) {
    this.productService.createProduct(product).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        alert('Failed to create product');
        console.error(error);
      },
    });
    this.productService.getProducts();
  }
}
