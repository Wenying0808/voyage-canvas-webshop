export interface Product {
    _id?: string;
    name: string;
    description: string;
    country: string;
    price: number;
    stock: number;
    imageUrls: string[];
}