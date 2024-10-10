import { Component, Input, input, Output, EventEmitter, effect, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '../../product.interface';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
  template: `
    <form 
      class="product-form" 
      autocomplete="off"
      [formGroup]="productForm" 
      (submit)="submitForm()"
    >
      <h2>{{ formTitle }}</h2>
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
        <input
          matInput
          placeholder="Country"
          formControlName="country"
          required
        />
        @if (country.invalid) {
        <mat-error>Country must be filled in.</mat-error>
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
        <mat-label>Images</mat-label>
        <input
          matInput
          formControlName="imageUrls"
          placeholder="Enter image URLs separated by commas"
          required
        />
        @if (imageUrls.invalid) {
        <mat-error>At least one image URL must be provided.</mat-error>
        }
      </mat-form-field>
      <br/>
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

  constructor(private formBuilder: FormBuilder){
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      country: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      imageUrls: ['', [Validators.required]]
    })
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
        country: this.initialProduct.country || '',
        price: this.initialProduct.price || 0,
        stock: this.initialProduct.stock || 0,
        imageUrls: this.initialProduct.imageUrls.join(', ') || '',
      });
    } else {
      this.productForm.reset();
    }
  };

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
  get imageUrls() {
    return this.productForm.get('imageUrls')!;
  }

  submitForm() {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      const product: Product = {
        ...formValue,
        imageUrls: formValue.imageUrls.split(',').map((url: string) => url.trim()).filter(Boolean)
      };
      this.formSubmitted.emit(product);
    }
  }
  cancel() {
    this.formCancelled.emit();
  }

}
