// src/components/CategoryList.tsx
'use client';

import { useEffect, useState } from 'react';
import { Category } from '../types/api';

interface CategoryListProps {
    onCategorySelect: (categoryId: number) => void;
}

export default function CategoryList({ onCategorySelect }: CategoryListProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<Set<number>>(new Set());
    const [scraping, setScraping] = useState(false);
    const [scrapingError, setScrapingError] = useState<string | null>(null);
    const [hasCategoriesInDb, setHasCategoriesInDb] = useState(false);

    const categoriesScraped = hasCategoriesInDb;

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = () => {
        setLoading(true);
        setError(null);
        fetch('http://localhost:8000/categories')
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data: Category[]) => {
                const categoryList = data || [];
                setCategories(categoryList);
                setHasCategoriesInDb(categoryList.length > 0);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching categories:', err);
                setCategories([]);
                setHasCategoriesInDb(false);
                setError(err.message);
                setLoading(false);
            });
    };

    const handleCategoryToggle = (categoryId: number) => {
        const newSelected = new Set(selectedCategories);
        if (newSelected.has(categoryId)) {
            newSelected.delete(categoryId);
        } else {
            newSelected.add(categoryId);
        }
        setSelectedCategories(newSelected);
    };

    const handleScrapeInitialCategories = async () => {
        setScraping(true);
        setScrapingError(null);

        try {
            const response = await fetch('http://localhost:8000/categories/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ base_url: 'http://books.toscrape.com/' })
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const result = await response.json();
            console.log('Categories scraped:', result);

            fetchCategories();
        } catch (err) {
            console.error('Error scraping initial categories:', err);
            setScrapingError(err instanceof Error ? err.message : 'Failed to scrape categories');
        } finally {
            setScraping(false);
        }
    };

    const handleScrapeBooks = async () => {
        if (selectedCategories.size === 0) {
            setScrapingError('Please select at least one category');
            return;
        }

        setScraping(true);
        setScrapingError(null);

        try {
            const selectedCats = categories.filter(cat => selectedCategories.has(cat.id));
            const payload = {
                categories: selectedCats.map(cat => ({
                    category_url: cat.url,
                    category_name: cat.name
                }))
            };

            const response = await fetch('http://localhost:8000/scrape/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const result = await response.json();
            console.log('Scraping completed:', result);

            setSelectedCategories(new Set());
            fetchCategories();
        } catch (err) {
            console.error('Error scraping books:', err);
            setScrapingError(err instanceof Error ? err.message : 'Failed to scrape books');
        } finally {
            setScraping(false);
        }
    };

    if (loading) {
        return <div className="text-center py-4">Loading categories...</div>;
    }

    if (error && !categoriesScraped) {
        return (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Categories</h2>
                <p className="text-red-600 mb-4">Error loading categories: {error}</p>
                <button
                    onClick={fetchCategories}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    // Condition 1: No categories in DB - show scrape button to fetch categories
    if (!categoriesScraped) {
        return (
            <div className="mb-8 p-6 bg-blue-50 border-2 border-blue-300 rounded-lg text-center">
                <h2 className="text-2xl font-bold mb-4">Categories</h2>
                <p className="text-gray-700 mb-6">No categories in database. Click the button below to scrape categories first.</p>
                <button
                    onClick={handleScrapeInitialCategories}
                    disabled={scraping}
                    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                    {scraping ? 'Scraping Categories...' : 'Scrape Categories'}
                </button>
                {scrapingError && (
                    <p className="text-red-600 mt-4">{scrapingError}</p>
                )}
            </div>
        );
    }

    // Condition 2: Categories exist in DB - show list with checkboxes and disabled scrape button
    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Categories</h2>
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                ====== {JSON.stringify(categories)}

                <h3 className="text-lg font-semibold mb-4">Select Categories to Scrape Books</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {categories.map(category => (
                        <label
                            key={category.id}
                            className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-white transition"
                        >
                            <input
                                type="checkbox"
                                checked={selectedCategories.has(category.id)}
                                onChange={() => handleCategoryToggle(category.id)}
                                className="w-4 h-4 mr-3"
                            />
                            <div className="flex-1">
                                <p className="font-semibold">{category.name}</p>
                                <p className="text-sm text-gray-600">
                                    {category.has_books ? '✓ Books scraped' : '○ No books yet'}
                                </p>
                            </div>
                        </label>
                    ))}
                </div>

                {scrapingError && (
                    <p className="text-red-600 mb-4 p-2 bg-red-50 rounded">{scrapingError}</p>
                )}

                <button
                    onClick={handleScrapeBooks}
                    disabled={scraping || selectedCategories.size === 0}
                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                    {scraping ? 'Scraping...' : `Scrape Selected (${selectedCategories.size})`}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map(category => (
                    <div
                        key={category.id}
                        className="border p-4 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                        onClick={() => onCategorySelect(category.id)}
                    >
                        <h3 className="text-lg font-semibold">{category.name}</h3>
                        <p className="text-sm text-gray-600">
                            {category.has_books ? '✓ Has books' : '○ No books yet'}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}