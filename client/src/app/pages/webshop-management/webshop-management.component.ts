import { Component, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

import { ProductService } from '../../product.service';
import { Product } from '../../product.interface';

@Component({
  selector: 'app-webshop-management',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule, 
    MatInputModule, 
    MatSelectModule, 
    MatCardModule, 
    MatTableModule,
    MatButtonModule,
  ],
  providers: [ProductService],
  template: `
    <div class="webshop-management" >
      <div class="webshop-management-toolbar">
        <mat-form-field class="webshop-management-toolbar-form-field">
          <input matInput [(ngModel)]="searchProductName" placeholder="Search product name" (keyup)="onSearch()">
        </mat-form-field>
        <mat-form-field class="webshop-management-toolbar-form-field">
          <mat-select [(ngModel)]="selectedCountry" (selectionChange)="onSearch()">
            <mat-option value="all">All Countries</mat-option>
            <mat-option *ngFor="let country of countries()" [value]="country">
              {{ country }}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <button mat-raised-button color="primary" [routerLink]="['/add-product']">
            Add Product
        </button>
      </div>
      <mat-card>
        <mat-card-header>
          <mat-card-title>List Of Products</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="products()">
            <ng-container matColumnDef="col-name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let product">{{ product.name }}</td>
            </ng-container>
            <ng-container matColumnDef="col-country">
              <th mat-header-cell *matHeaderCellDef>Country</th>
              <td mat-cell *matCellDef="let product">{{ product.country.name }}</td>
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
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let product">
                <div class="table-action-button-group">
                  <button mat-raised-button [routerLink]="['/edit-product', product._id]">
                    Edit
                  </button>
                  <button
                    mat-raised-button
                    color="warn"
                    (click)="deleteProduct(product._id || '')"
                  >
                    Delete
                  </button>
                </div>
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
  products: Signal<Product[]>; //ready only
  countries: Signal<string[]>;

  displayedColumns: string[] = [
    'col-name',
    'col-country',
    'col-price',
    'col-stock',
    'col-action',
  ];

  searchProductName: string = '';
  selectedCountry: string = 'all';

  constructor(private productService: ProductService) {
    this.products = this.productService.products$;
    this.countries = this.productService.countries$;
  }

  ngOnInit() {
    this.fetchProducts();
    this.productService.getCountries();
  }

  deleteProduct(id: string): void {
    this.productService.deleteProduct(id).subscribe({
      next: () => this.fetchProducts(),
    });
  }

  onSearch(): void {
    this.fetchProducts();
  }

  private fetchProducts(): void {
    this.productService.getProducts(this.searchProductName, this.selectedCountry);
  }
}
