// create a service that handles all communication with the /product endpoint of the API. 
// using the HttpClient service to make HTTP requests to our API.

import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from './product.interface';

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  private url = 'http://localhost:5200';
  products$: WritableSignal<Product[]> = signal([]); //  $ as reactive data source to store an array of product objects
  product$: WritableSignal<Product> = signal({} as Product);
  countries$: WritableSignal<string[]> = signal([]);

  // dependency injection for making HTTP request
  constructor(private httpClient: HttpClient) {}

  getProducts(nameSearch?: string, countryFilter?: string){
    let url = `${this.url}/products`;
    const params: string[] = [];
    if (nameSearch) params.push(`nameSearch=${encodeURIComponent(nameSearch)}`); // ["nameSearch=lovely%20house"]
    if (countryFilter) params.push(`countryFilter=${encodeURIComponent(countryFilter)}`); // ["nameSearch=lovely%20house", "countryFilter=Netherlands"]
    if (params.length) url += '?' + params.join('&'); // http://localhost:3000/api/products?nameSearch=lovely%20house&countryFilter=Netherlands

    this.httpClient.get<Product[]>(url).subscribe(products => {
      this.products$.set(products);
    });
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

  getCountries(): void{
    this.httpClient.get<string[]>(`${this.url}/products/countries`).subscribe(countries => {
      this.countries$.set(countries);
    })
  }
}
