"use client";

interface Category {
    id: number;
    name: string;
    url: string;
    has_books: boolean;
}

interface CategoryListProps {
    categories: Category[];
    loading: boolean;
    selectedCategoryIds: Set<number>;
    onCategoryToggle: (categoryId: number) => void;
}

export default function CategoryList({
    categories,
    loading,
    selectedCategoryIds,
    onCategoryToggle
}: CategoryListProps) {
    return (
        <div className="flex flex-col h-full">
            {/* Categories List */}
            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="p-4 text-sm text-gray-300">Loading...</div>
                ) : categories.length === 0 ? (
                    <div className="p-4 text-sm text-gray-300">
                        <p className="font-semibold text-white mb-2">CATEGORIES</p>
                        <p className="text-xs text-gray-400">No categories available</p>
                    </div>
                ) : (
                    <div className="p-4">
                        <p className="font-semibold text-sm mb-4 text-white uppercase tracking-wide">Categories</p>
                        <div className="space-y-2">
                            {categories.map((category) => (
                                <label
                                    key={category.id}
                                    className={`flex items-start p-3 rounded-lg text-sm cursor-pointer transition-all duration-200 ${
                                        selectedCategoryIds.has(category.id)
                                            ? "bg-gray-700 border border-gray-600"
                                            : "hover:bg-gray-700/50 border border-transparent"
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedCategoryIds.has(category.id)}
                                        onChange={() => onCategoryToggle(category.id)}
                                        className="w-4 h-4 mr-3 mt-0.5 text-violet-600 focus:ring-violet-500 rounded border-gray-500 bg-gray-700 checked:bg-violet-600"
                                    />
                                    <div className="flex-1">
                                        <span className="truncate block text-gray-100 font-medium">{category.name}</span>
                                        {category.has_books && (
                                            <span className="text-xs text-emerald-400 font-semibold">✓ Scraped</span>
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
