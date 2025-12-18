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
    image_url?: string;
    upc?: string;
    product_type?: string;
    rating?: string;
    number_of_reviews?: string;
    price_excl_tax?: string;
    price_incl_tax?: string;
    tax?: string;
    details_scraped?: number;
    category?: string;
}

export interface BookListResponse {
    books: Book[];
}

export interface CategoryListResponse {
    categories: Category[];
}