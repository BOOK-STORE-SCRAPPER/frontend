// src/components/CategorySidebar.tsx
'use client';

import { useCallback, useEffect, useState } from 'react';
import { Category } from '../types/api';
import { api } from '../lib/api';

interface CategorySidebarProps {
    onCategoriesScraped: (count: number) => void;
    selectedCategoryIds: Set<number>;
    onCategoryToggle: (categoryId: number) => void;
}

export default function CategorySidebar({
    onCategoriesScraped,
    selectedCategoryIds,
    onCategoryToggle
}: CategorySidebarProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [scraping, setScraping] = useState(false);
    const [scrapingSelected, setScrapingSelected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = useCallback(() => {
        setLoading(true);
        setError(null);
        api.get<Category[]>('/categories')
            .then((data: Category[]) => {
                const categoryList = data || [];
                setCategories(categoryList);
                onCategoriesScraped(categoryList.length);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching categories:', err);
                setCategories([]);
                onCategoriesScraped(0);
                setError(err.message);
                setLoading(false);
            });
    }, [onCategoriesScraped]);

    useEffect(() => {
        // Only fetch on initial mount
        fetchCategories();
    }, []);

    const handleScrapeCategories = async () => {
        setScraping(true);
        setError(null);

        try {
            await api.post('/categories/', { base_url: 'http://books.toscrape.com/' });
            fetchCategories();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to scrape categories');
        } finally {
            setScraping(false);
        }
    };

    const handleScrapeSelectedCategories = async () => {
        if (selectedCategoryIds.size === 0) {
            setError('Please select at least one category');
            return;
        }

        setScrapingSelected(true);
        setError(null);

        try {
            const selectedCats = categories.filter(cat => selectedCategoryIds.has(cat.id));
            const payload = {
                categories: selectedCats.map(cat => ({
                    category_url: cat.url,
                    category_name: cat.name
                }))
            };

            await api.post('/scrape/categories', payload);

            // Refetch categories to update has_books status
            fetchCategories();
        } catch (err) {
            console.error('Error scraping selected categories:', err);
            setError(err instanceof Error ? err.message : 'Failed to scrape selected categories');
        } finally {
            setScrapingSelected(false);
        }
    };



    return (
        <div className="flex flex-col h-full">
            {/* Buttons Section */}
            <div className="p-4 border-b space-y-2">
                <button
                    onClick={handleScrapeCategories}
                    disabled={scraping || categories.length > 0}
                    className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition text-sm"
                >
                    {scraping ? 'Scraping...' : 'SCRAP CATEGORIES'}
                </button>

                {categories.length > 0 && selectedCategoryIds.size > 0 && (
                    <button
                        onClick={handleScrapeSelectedCategories}
                        disabled={scrapingSelected}
                        className="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition text-sm"
                    >
                        {scrapingSelected ? 'Scraping...' : `SCRAPE SELECTED (${selectedCategoryIds.size})`}
                    </button>
                )}

                {error && (
                    <p className="text-red-600 text-xs p-2 bg-red-50 rounded">{error}</p>
                )}
            </div>

            {/* Categories List */}
            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="p-4 text-sm text-gray-600">Loading...</div>
                ) : error ? (
                    <div className="p-4 text-sm text-red-600">{error}</div>
                ) : categories.length === 0 ? (
                    <div className="p-4 text-sm text-gray-600">
                        <p className="font-semibold">LIST OF CATEGORIES</p>
                        <p className="text-xs mt-2">EMPTY-LIST</p>
                    </div>
                ) : (
                    <div className="p-4">
                        <p className="font-semibold text-sm mb-3">LIST OF CATEGORIES</p>
                        <div className="space-y-2">
                            {categories.map(category => (
                                <label
                                    key={category.id}
                                    className={`flex items-start p-2 rounded text-sm ${category.has_books
                                        ? 'bg-gray-50 cursor-not-allowed'
                                        : 'hover:bg-gray-100 cursor-pointer'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedCategoryIds.has(category.id)}
                                        onChange={() => onCategoryToggle(category.id)}
                                        disabled={category.has_books}
                                        className="w-4 h-4 mr-2 mt-0.5 disabled:cursor-not-allowed"
                                    />
                                    <div className="flex-1">
                                        <span className="truncate block">{category.name}</span>
                                        {category.has_books && (
                                            <span className="text-xs text-green-600 font-semibold">scraped</span>
                                        )}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
