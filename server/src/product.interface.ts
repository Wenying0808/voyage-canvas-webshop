import * as mongodb from 'mongodb';

export interface Product {
    _id?: mongodb.ObjectId;
    name: string;
    description: string;
    country: string;
    price: number;
    stock: number;
    imageUrls: string[];
}