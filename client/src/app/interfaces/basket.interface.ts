import { Product } from "./product.interface";

export interface BasketItem {
    productId: string;
    quantity: number;
}
  
export interface Basket {
    _id: string;
    userId: string;
    items: BasketItem[];
}