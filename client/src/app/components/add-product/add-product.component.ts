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
    <div class="add-product">
      <app-product-form
        [formMode]="'add'"
        (formSubmitted)="addProduct($event)"
        (formCancelled)="cancel()"
      ></app-product-form>
    </div>
  `,
  styleUrl: `./add-product.component.scss`,
})
export class AddProductComponent {
  constructor(
    private router: Router,
    private productService: ProductService
  ) {}

  addProduct(product: Product) {
    this.productService.createProduct(product).subscribe({
      next: () => {
        this.router.navigate(['/webshop-management']);
      },
      error: (error) => {
        alert('Failed to create product');
        console.error(error);
      },
    });
    this.productService.getProducts();
  }
  cancel() {
    this.router.navigate(['/webshop-management']);
  }
}
