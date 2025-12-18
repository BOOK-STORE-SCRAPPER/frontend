// src/components/BookList.tsx
'use client';

import { useEffect, useState } from 'react';
import { Book } from '../types/api';
import { api } from '../lib/api';

interface BookListProps {
    categoryIds: number[];
    onBookSelect: (bookId: number) => void;
}

export default function BookList({ categoryIds, onBookSelect }: BookListProps) {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setError(null);

        // Fetch books for selected categories or all books if none selected
        const fetchBooksForCategories = async () => {
            try {
                const allBooks: Book[] = [];

                if (categoryIds && categoryIds.length > 0) {
                    // Fetch books for selected categories
                    for (const categoryId of categoryIds) {
                        const data = await api.get<{ books: Book[] }>(`/scrape/books?category_id=${categoryId}`);
                        allBooks.push(...(data.books || []));
                    }
                } else {
                    // Fetch all books when no categories selected
                    const data = await api.get<{ books: Book[] }>('/scrape/books');
                    allBooks.push(...(data.books || []));
                }

                setBooks(allBooks);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching books:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch books');
                setLoading(false);
            }
        };

        fetchBooksForCategories();
    }, [categoryIds]);

    if (error && books.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600">Error: {error}</p>
            </div>
        );
    }

    if (books.length === 0 && loading) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600">Loading books...</p>
            </div>
        );
    }

    if (books.length === 0) {
        return (
            <div className="h-full flex items-center justify-center bg-yellow-100 rounded-lg">
                <p className="text-2xl text-gray-600">LIST OF PRODUCTS EMPTY</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Books ({books.length})</h2>
            <div className="overflow-x-auto border rounded-lg">
                <table className="w-full">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Availability</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book, index) => (
                            <tr
                                key={book.id}
                                className="border-b hover:bg-blue-50 cursor-pointer transition"
                                onClick={() => onBookSelect(book.id)}
                            >
                                <td className="px-4 py-3 text-sm text-gray-600 font-semibold">
                                    {index + 1}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                                    {book.title}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                    {book.category && (
                                        <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">
                                            {book.category}
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-sm font-bold text-green-600">
                                    {book.price}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                    {book.availability}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}