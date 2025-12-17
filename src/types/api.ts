// src/types/api.ts
export interface Category {
    id: number;
    name: string;
    url: string;
    has_books: boolean;
}

export interface Book {
    id: number;
    title: string;
    price: string;
    availability: string;
    description?: string;
    image_path?: string;
    upc?: string;
    category?: string;
}

export interface BookListResponse {
    books: Book[];
}

export interface CategoryListResponse {
    categories: Category[];
}