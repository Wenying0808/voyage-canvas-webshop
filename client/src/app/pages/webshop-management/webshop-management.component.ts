import { Component, OnInit, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { ProductService } from '../../product.service';
import { Product } from '../../product.interface';

@Component({
  selector: 'app-webshop-management',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatTableModule],
  providers: [ProductService],
  template: `
    <div class="webshop-management" >
      <div class="webshop-management-toolbar">
        <button mat-raised-button color="primary" [routerLink]="['/add-product']">
            Create New Product
        </button>
      </div>
      <mat-card>
        <mat-card-header>
          <mat-card-title>Products List</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="products$()">
            <ng-container matColumnDef="col-name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let product">{{ product.name }}</td>
            </ng-container>
            <ng-container matColumnDef="col-country">
              <th mat-header-cell *matHeaderCellDef>Country</th>
              <td mat-cell *matCellDef="let product">{{ product.country }}</td>
            </ng-container>
            <ng-container matColumnDef="col-price">
              <th mat-header-cell *matHeaderCellDef>Price</th>
              <td mat-cell *matCellDef="let product">{{ product.price }}</td>
            </ng-container>
            <ng-container matColumnDef="col-stock">
              <th mat-header-cell *matHeaderCellDef>Stock</th>
              <td mat-cell *matCellDef="let product">{{ product.stock }}</td>
            </ng-container>
            <ng-container matColumnDef="col-action">
              <th mat-header-cell *matHeaderCellDef>Action</th>
              <td mat-cell *matCellDef="let product">
                <button mat-raised-button [routerLink]="['edit/', product._id]">
                  Edit
                </button>
                <button
                  mat-raised-button
                  color="warn"
                  (click)="deleteProduct(product._id || '')"
                >
                  Delete
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>

          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styleUrl: `./webshop-management.component.scss`
})

export class WebshopMnagementComponent implements OnInit {
  products$ = {} as WritableSignal<Product[]>;
  displayedColumns: string[] = [
    'col-name',
    'col-country',
    'col-price',
    'col-stock',
    'col-action',
  ];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.fetchProducts();
  }

  deleteProduct(id: string): void {
    this.productService.deleteProduct(id).subscribe({
      next: () => this.fetchProducts(),
    });
  }

  private fetchProducts(): void {
    this.products$ = this.productService.products$;
    this.productService.getProducts();
  }
}
