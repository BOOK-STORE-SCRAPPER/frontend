"use client";

import { useState } from "react";
import CategorySidebar from "../components/CategorySidebar";
import BookList from "../components/BookList";
import BookDetails from "../components/BookDetails";
import StatsBox from "../components/StatsBox";

export default function Home() {
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<number>>(new Set());
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [clearing, setClearing] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const handleCategoriesScraped = (count: number) => {
    setCategoriesCount(count);
    // Trigger refetch of books
    setRefetchTrigger(prev => prev + 1);
  };

  const handleCategoryToggle = (categoryId: number) => {
    const newSelected = new Set(selectedCategoryIds);
    if (newSelected.has(categoryId)) {
      newSelected.delete(categoryId);
    } else {
      newSelected.add(categoryId);
    }
    setSelectedCategoryIds(newSelected);
  };

  const handleBookSelect = (bookId: number) => {
    setSelectedBookId(bookId);
  };

  const handleBackToBooks = () => {
    setSelectedBookId(null);
  };

  const handleClearDatabase = async () => {
    if (!confirm('Are you sure you want to clear all data from the database?')) {
      return;
    }

    setClearing(true);

    try {
      const response = await fetch('http://localhost:8000/categories/clear', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      setCategoriesCount(0);
      setSelectedCategoryIds(new Set());
      setSelectedBookId(null);
      window.location.reload();
    } catch (err) {
      console.error('Error clearing database:', err);
      alert('Failed to clear database');
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold flex-1 text-center">Book Store Scraper</h1>
            {categoriesCount > 0 && (
              <button
                onClick={handleClearDatabase}
                disabled={clearing}
                className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition text-sm"
              >
                {clearing ? 'Clearing...' : 'CLEAR DB'}
              </button>
            )}
          </div>
          <StatsBox />
        </div>
      </div>

      <div className="flex h-[calc(100vh-100px)]">
        {/* Left Sidebar */}
        <div className="w-[300px] bg-white border-r overflow-y-auto">
          <CategorySidebar
            onCategoriesScraped={handleCategoriesScraped}
            selectedCategoryIds={selectedCategoryIds}
            onCategoryToggle={handleCategoryToggle}
          />
        </div>

        {/* Right Panel */}
        <div className="flex-1 overflow-y-auto p-8">
          {categoriesCount === 0 ? (
            <div className="h-full flex items-center justify-center bg-yellow-100 rounded-lg">
              <p className="text-2xl text-gray-600">LIST OF PRODUCTS EMPTY</p>
            </div>
          ) : selectedBookId ? (
            <BookDetails bookId={selectedBookId} onBack={handleBackToBooks} />
          ) : (
            <BookList
              key={refetchTrigger}
              categoryIds={selectedCategoryIds.size > 0 ? Array.from(selectedCategoryIds) : []}
              onBookSelect={handleBookSelect}
            />
          )}
        </div>
      </div>
    </div>
  );
}
