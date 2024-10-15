import { Product } from "./product.interface";

export interface BasketItem {
    product: Product;
    quantity: number;
}
  
export interface Basket {
    _id?: string;
    items: BasketItem[];
    userId: string | null;  // null for non-logged in users
    sessionId: string;      // for non-logged in users
}
  