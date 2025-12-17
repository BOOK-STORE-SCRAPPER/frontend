// src/components/StatsBox.tsx
'use client';

import { useEffect, useState } from 'react';

interface Stats {
    categories: number;
    books: number;
}

export default function StatsBox() {
    const [stats, setStats] = useState<Stats>({ categories: 0, books: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
        // Refresh stats every 5 seconds
        const interval = setInterval(fetchStats, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('http://localhost:8000/categories/stats');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            setStats(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching stats:', err);
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-8">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                        {loading ? '-' : stats.categories}
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Categories Scraped</p>
                        <p className="text-xs text-gray-500">Total categories in database</p>
                    </div>
                </div>

                <div className="border-l border-blue-200"></div>

                <div className="flex items-center gap-3">
                    <div className="bg-indigo-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                        {loading ? '-' : stats.books}
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Books Scraped</p>
                        <p className="text-xs text-gray-500">Total books in database</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
