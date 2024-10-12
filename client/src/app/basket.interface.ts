export interface BasketItem {
    productId: string;
    quantity: number;
    price: number;
}
  
export interface Basket {
_id?: string;
userId: string | null;  // null for non-logged in users
sessionId: string;      // for non-logged in users
items: BasketItem[];
createdAt: Date;
updatedAt: Date;
}