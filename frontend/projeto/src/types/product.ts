import { Category } from "./category";

export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    createdAt: string;
    updatedAt: string;
    images?: ProductImage[];
    categories?: Category[];
}

export interface ProductImage {
    id: number;
    productId: number;
    imageUrl: string;
}
