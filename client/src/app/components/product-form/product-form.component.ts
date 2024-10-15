import { Component, Input, input, Output, EventEmitter, effect, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '../../interfaces/product.interface';
import { CountryService } from '../../services/country.service';
import { AsyncPipe, NgForOf } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    AsyncPipe, 
    NgForOf
  ],
  template: `
    <form 
      class="product-form" 
      autocomplete="off"
      [formGroup]="productForm" 
      (submit)="submitForm()"
    >
      <div class="product-form-title">
        {{ formTitle }}
      </div>
      <br/>
      <mat-form-field>
        <mat-label>Name</mat-label>
        <input 
          matInput 
          placeholder="Name" 
          formControlName="name" 
          required 
        />
        @if (name.invalid) {
        <mat-error>Name must be filled in.</mat-error>
        }
      </mat-form-field>
      <mat-form-field>
        <mat-label>Description</mat-label>
        <input
          matInput
          placeholder="Product Description"
          formControlName="description"
          required
        />
        @if (description.invalid) {
        <mat-error>Description must be filled in.</mat-error>
        }
      </mat-form-field>
      <mat-form-field>
        <mat-label>Country</mat-label>
        <mat-select formControlName="country" required [compareWith]="compareCountries">
          @for (country of countries$ | async; track country.code) {
            <mat-option [value]="country">
              {{ country.name }}
            </mat-option>
          }
        </mat-select>
        @if (country.invalid) {
        <mat-error>Country must be selected.</mat-error>
        }
      </mat-form-field>
      <mat-form-field>
        <mat-label>Price</mat-label>
        <input
          matInput
          type="number"
          value=0
          formControlName="price"
          required
        />
        @if (price.invalid) {
        <mat-error>Price must be larger than 0.</mat-error>
        }
      </mat-form-field>
      <mat-form-field>
        <mat-label>Stock</mat-label>
        <input
          matInput
          type="number"
          value=0
          formControlName="stock"
          required
        />
        @if (stock.invalid) {
        <mat-error>Stock must be larger than 0.</mat-error>
        }
      </mat-form-field>
      <mat-form-field>
        <mat-label>Image</mat-label>
        <input
          matInput
          formControlName="imageUrl"
          placeholder="Enter image URL"
          required
        />
        @if (imageUrl.invalid) {
        <mat-error>The image URL must be provided.</mat-error>
        }
      </mat-form-field>
      <br/>
      <div class="product-form-buttions">
        <button
          mat-raised-button
          color="primary"
          (click)="cancel()"
        >
          Cancel
        </button>
        <button 
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="productForm.invalid"
        >
        {{ submitButtonText }}
        </button>
      </div>
    </form>
  `,
  styleUrl: `./product-form.component.scss`
})

export class ProductFormComponent implements OnInit, OnChanges{
  
  @Input() initialProduct: Product | null = null;
  @Input() formMode: 'add' | 'edit' = 'add';
  @Output() forValuesChanged = new EventEmitter<Product>();
  @Output() formCancelled = new EventEmitter<void>();
  @Output() formSubmitted = new EventEmitter<Product>();

  productForm: FormGroup;
  formTitle: string = 'Add Product';
  submitButtonText: string = 'Add';
  countries$: Observable<{ name: string; code: string }[]>;

  constructor(
    private formBuilder: FormBuilder, 
    private countryService: CountryService
  ){
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      country: [null, [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      imageUrl: ['', [Validators.required]]
    });
    this.countries$ = this.countryService.getCountries();
  }

  ngOnInit() {
    this.updateFormMode();
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['formMode']) {
      this.updateFormMode();
    }
    if (changes['initialProduct']) {
      this.initializeForm();
    }
  }

  private updateFormMode(){
    if(this.formMode === 'edit'){
      this.formTitle = 'Edit Product';
      this.submitButtonText = 'Update';
    } else {
      this.formTitle = 'Add Product';
      this.submitButtonText = 'Add';
    }
  }

  private initializeForm(){
    if (this.initialProduct) {
      this.productForm.patchValue({
        name: this.initialProduct.name || '',
        description: this.initialProduct.description || '',   
        price: this.initialProduct.price || 0,
        stock: this.initialProduct.stock || 0,
        imageUrl: this.initialProduct.imageUrl || '',
      });
      /*console.log("loaded product:", this.initialProduct);*/

      // Set country after countries have been loaded as patchValues for ma-select doesn't work
      this.countries$.subscribe(countries => {
        if (this.initialProduct && this.initialProduct.country){
          const selectedCountry = countries.find(c => c.code === this.initialProduct?.country.code);
          if (selectedCountry) {
            this.productForm.get('country')?.setValue(selectedCountry);
          }
        }
      });
    } else {
      this.productForm.reset();
    }
  };

  // for mat-select component
  compareCountries(country1: any, country2: any): boolean {
    return country1 && country2 ? country1.code === country2.code : country1 === country2;
  }

// Form Accessors 
  get name() {
    return this.productForm.get('name')!;
  }
  get description() {
    return this.productForm.get('description')!;
  }
  get country() {
    return this.productForm.get('country')!;
  }
  get price() {
    return this.productForm.get('price')!;
  }
  get stock() {
    return this.productForm.get('stock')!;
  }
  get imageUrl() {
    return this.productForm.get('imageUrl')!;
  }

  submitForm() {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      const product: Product = {
        ...formValue,

        imageUrl: formValue.imageUrl,
        // Remove imageUrls from the submitted product
        imageUrls: undefined
      };
      this.formSubmitted.emit(product); //send data from child component to parent component
    }
  }
  cancel() {
    this.formCancelled.emit();
  }

}
