"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navigation from "../components/Navigation";
import CategoryList from "../components/CategoryList";
import BookList from "../components/BookList";
import BookDetails from "../components/BookDetails";
import StatsBox from "../components/StatsBox";
import { api } from "../lib/api";

export default function Home() {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<number>>(new Set());
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await api.get<any[]>("/categories/");
      setCategories(data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      
      <div className="p-6">
        <StatsBox />
      </div>

      <div className="flex h-[calc(100vh-180px)] px-6 pb-6 gap-6">
        {/* Left Sidebar - Dark Theme */}
        <div className="w-[300px] bg-gray-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden">
          <CategoryList
            categories={categories}
            loading={loading}
            selectedCategoryIds={selectedCategoryIds}
            onCategoryToggle={handleCategoryToggle}
          />
        </div>

        {/* Right Panel - Light Theme */}
        <div className="flex-1 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          {categories.length === 0 ? (
            <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-center">
                <p className="text-2xl text-gray-800 mb-4 font-semibold">No Data Available</p>
                <p className="text-gray-600">Go to <Link href="/admin" className="text-violet-600 font-semibold hover:text-violet-700 hover:underline transition">Admin</Link> to scrape data</p>
              </div>
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
