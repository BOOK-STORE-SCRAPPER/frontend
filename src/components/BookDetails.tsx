// src/components/BookDetails.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Book } from '../types/api';
import { api, getImageUrl } from '../lib/api';

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
            setLoading(false);
            return;
        }

        const fetchBookDetails = async () => {
            setLoading(true);
            setBook(null);

            try {
                const data = await api.get<{ book: Book }>(`/scrape/books/${bookId}`);
                setBook(data.book || null);
            } catch (err) {
                console.error('Error fetching book details:', err);
                setBook(null);
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetails();
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
                        {(book.image_path || book.image_url) && (
                            <div className="relative w-full h-96">
                                <Image
                                    src={getImageUrl(book.image_path, book.image_url)}
                                    alt={book.title}
                                    fill
                                    className="object-cover rounded-lg"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority={false}
                                />
                            </div>
                        )}
                        {book.details_scraped === 0 && (
                            <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded">
                                <p className="text-sm">⚠️ Product details not yet scraped</p>
                            </div>
                        )}
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
                        <p className="text-2xl text-green-600 font-bold mb-2">{book.price}</p>
                        <p className="text-lg mb-2">
                            <span className="font-semibold">Availability:</span> {book.availability}
                        </p>

                        {/* Product Details */}
                        <div className="space-y-2 mb-4">
                            {book.upc && (
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold">UPC:</span> {book.upc}
                                </p>
                            )}
                            {book.product_type && (
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold">Product Type:</span> {book.product_type}
                                </p>
                            )}
                            {book.rating && (
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold">Rating:</span> {book.rating}
                                </p>
                            )}
                            {book.number_of_reviews && (
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold">Reviews:</span> {book.number_of_reviews}
                                </p>
                            )}
                            {book.price_excl_tax && (
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold">Price (excl. tax):</span> {book.price_excl_tax}
                                </p>
                            )}
                            {book.price_incl_tax && (
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold">Price (incl. tax):</span> {book.price_incl_tax}
                                </p>
                            )}
                            {book.tax && (
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold">Tax:</span> {book.tax}
                                </p>
                            )}
                        </div>

                        {book.description && (
                            <div className="mt-6">
                                <h2 className="text-xl font-semibold mb-2">Description</h2>
                                <p className="text-gray-700 leading-relaxed">{book.description}</p>
                            </div>
                        )}

                        {!book.description && book.details_scraped === 0 && (
                            <div className="mt-6 p-4 bg-gray-100 rounded">
                                <p className="text-gray-600">Product details not available. Run scraping from Admin panel to get full details.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}