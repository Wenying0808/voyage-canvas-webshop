import { Product } from "./product.interface";

export interface BasketItem {
    product: Product;
    quantity: number;
}
  
export interface Basket {
    _id?: string;
    items: BasketItem[];
}