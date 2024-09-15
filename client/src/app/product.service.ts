// create a service that handles all communication with the /product endpoint of the API. 
// using the HttpClient service to make HTTP requests to our API.

import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from './product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private url = 'http://localhost:5200';
  products$ = signal<Product[]>([]); //  $ as reactive data sources
  product$ = signal<Product>({} as Product);

  constructor(private httpClient: HttpClient) { }
  private refreshProducts() {
    this.httpClient.get<Product[]>(`${this.url}/products`)
      .subscribe(products => {
        this.products$.set(products);
      })
  }

  getProducts(){
    this.refreshProducts();
    return this.products$();
  }

  getProduct(id: string){
    this.httpClient.get<Product>(`${this.url}/products/${id}`).subscribe(product => {
      this.product$.set(product);
      return this.product$();
    })
  }

  createProduct(product: Product){
    return this.httpClient.post(`${this.url}/products`, product, { responseType: 'text' });
  }

  updateProduct(id: string, product: Product){
    return this.httpClient.put(`${this.url}/products/${id}`, product, { responseType: 'text' });
  }

  deleteProduct(id: string){
    return this.httpClient.delete(`${this.url}/products/${id}`, { responseType: 'text' });
  }
}
