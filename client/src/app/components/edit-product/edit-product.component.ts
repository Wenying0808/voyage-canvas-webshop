import { Component, OnInit, WritableSignal } from '@angular/core';
import { ProductFormComponent } from '../product-form/product-form.component';
import { Product } from '../../product.interface';
import { ProductService } from '../../product.service';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [ProductFormComponent, MatCardModule],
  template: `
    <div class="edit-product">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Edit a Product</mat-card-title>
        </mat-card-header>
        <mat-card-content>
        <app-product-form
          [initialState]="product()"
          (formSubmitted)="editProduct($event)"
        ></app-product-form>
      </mat-card-content>
      </mat-card>
    </div>
  `,
  styleUrl: `./edit-product.component.scss`
})
export class EditProductComponent implements OnInit {

  product = {} as WritableSignal<Product>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService
  ){}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      alert('No id provided for product edition');
    }
    this.productService.getProduct(id!);
    this.product = this.productService.product$;
  }

  editProduct(product: Product){
    this.productService
    .updateProduct(this.product()._id || '', product)
    .subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        alert('Failed to update product');
        console.error(error);
      },
    })
  }
}
