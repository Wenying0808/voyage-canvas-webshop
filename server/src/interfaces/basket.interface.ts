import * as mongodb from 'mongodb';

export interface BasketItem {
    productId: string; // reference to the _id of product
    quantity: number;
}
  
export interface Basket {
    _id: mongodb.ObjectId;
    userId: string;
    items: BasketItem[];
}
  