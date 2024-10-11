import * as mongodb from 'mongodb';

export interface Product {
    _id?: mongodb.ObjectId;
    name: string;
    description: string;
    country: {
        code: string;
        name: string;
    };
    price: number;
    stock: number;
    imageUrl: string;
}