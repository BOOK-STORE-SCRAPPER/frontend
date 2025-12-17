// src/components/BookDetails.tsx
'use client';

import { useEffect, useState } from 'react';
import { Book } from '../types/api';

interface BookDetailsProps {
    bookId: number | null;
    onBack: () => void;
}

export default function BookDetails({ bookId, onBack }: BookDetailsProps) {
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!bookId) {
            setBook(null);
            return;
        }

        setLoading(true);
        fetch(`http://localhost:8000/scrape/books/${bookId}`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data: { book: Book }) => {
                setBook(data.book || null);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching book details:', err);
                setBook(null);
                setLoading(false);
            });
    }, [bookId]);

    if (!bookId) return null;
    if (loading) return <div>Loading book details...</div>;
    if (!book) return (
        <div className="max-w-4xl mx-auto">
            <button
                onClick={onBack}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                ← Back to Books
            </button>
            <div>Book not found</div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <button
                onClick={onBack}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                ← Back to Books
            </button>

            <div className="bg-white border rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        {book.image_path && (
                            <img
                                src={`http://localhost:8000${book.image_path}`}
                                alt={book.title}
                                className="w-full h-96 object-cover rounded-lg"
                            />
                        )}
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
                        <p className="text-2xl text-green-600 font-bold mb-2">{book.price}</p>
                        <p className="text-lg mb-2">
                            <span className="font-semibold">Availability:</span> {book.availability}
                        </p>
                        {book.upc && (
                            <p className="text-sm text-gray-600 mb-4">
                                <span className="font-semibold">UPC:</span> {book.upc}
                            </p>
                        )}

                        {book.description && (
                            <div className="mt-6">
                                <h2 className="text-xl font-semibold mb-2">Description</h2>
                                <p className="text-gray-700 leading-relaxed">{book.description}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}