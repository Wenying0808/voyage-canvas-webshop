export interface Product {
    _id?: string;
    name: string;
    description: string;
    country: {
        code: string;
        name: string;
    };
    price: number;
    stock: number;
    imageUrls: string[];
}