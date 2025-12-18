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
                    <div className="p-4 text-sm text-gray-600">Loading...</div>
                ) : categories.length === 0 ? (
                    <div className="p-4 text-sm text-gray-600">
                        <p className="font-semibold">CATEGORIES</p>
                        <p className="text-xs mt-2">No categories available</p>
                    </div>
                ) : (
                    <div className="p-4">
                        <p className="font-semibold text-sm mb-3">CATEGORIES</p>
                        <div className="space-y-2">
                            {categories.map((category) => (
                                <label
                                    key={category.id}
                                    className="flex items-start p-2 rounded text-sm hover:bg-gray-100 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedCategoryIds.has(category.id)}
                                        onChange={() => onCategoryToggle(category.id)}
                                        className="w-4 h-4 mr-2 mt-0.5"
                                    />
                                    <div className="flex-1">
                                        <span className="truncate block">{category.name}</span>
                                        {category.has_books && (
                                            <span className="text-xs text-green-600 font-semibold">✓ Scraped</span>
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
