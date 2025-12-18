"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
      <div className="bg-white border-b">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold flex-1 text-center">Book Store</h1>
            <Link href="/admin">
              <button className="px-4 py-2 bg-purple-500 text-white font-semibold rounded hover:bg-purple-600 transition text-sm">
                Admin
              </button>
            </Link>
          </div>
          <StatsBox />
        </div>
      </div>

      <div className="flex h-[calc(100vh-100px)]">
        {/* Left Sidebar */}
        <div className="w-[300px] bg-white border-r overflow-y-auto">
          <CategoryList
            categories={categories}
            loading={loading}
            selectedCategoryIds={selectedCategoryIds}
            onCategoryToggle={handleCategoryToggle}
          />
        </div>

        {/* Right Panel */}
        <div className="flex-1 overflow-y-auto p-8">
          {categories.length === 0 ? (
            <div className="h-full flex items-center justify-center bg-yellow-100 rounded-lg">
              <div className="text-center">
                <p className="text-2xl text-gray-600 mb-4">No Data Available</p>
                <p className="text-gray-600">Go to <Link href="/admin" className="text-purple-500 font-semibold hover:underline">Admin</Link> to scrape data</p>
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
