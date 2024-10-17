import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ProductFormComponent } from '../product-form/product-form.component';
import { Product } from '../../interfaces/product.interface';
import { ProductService } from '../../services/product.service';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [ProductFormComponent, MatCardModule],
  template: `
    <div class="edit-product">  
      <app-product-form
        [formMode]="'edit'"
        [initialProduct]="product()"
        (formSubmitted)="editProduct($event)"
        (formCancelled)="cancel()"
      ></app-product-form>
    </div>
  `,
  styleUrl: `./edit-product.component.scss`
})
export class EditProductComponent implements OnInit {

  product: WritableSignal<Product | null> = signal(null);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService
  ){}

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) {
          throw new Error('No id provided for product edition');
        }
        return this.productService.getProduct(id);
      }),
      tap(product => {
        console.log('Fetched product:', product);
        this.product.set(product);
      })
    ).subscribe({
      error: (error) => {
        console.error('Error fetching product:', error);
        alert('Failed to load product data');
      }
    });
  }

  editProduct(updatedProduct: Product){
    this.productService
    .updateProduct(this.product()?._id || '', updatedProduct)
    .subscribe({
      next: () => {
        this.router.navigate(['/webshop-management']);
      },
      error: (error) => {
        alert('Failed to update product');
        console.error(error);
      },
    })
  }
  cancel() {
    this.router.navigate(['/webshop-management']);
  }
}
