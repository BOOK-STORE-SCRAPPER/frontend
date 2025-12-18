"use client";

import React, { useState } from "react";
import { api } from "../lib/api";

interface ScrapingStatus {
    job_id: number;
    status: string;
    category_name: string;
    items_scraped: number;
    started_at: string;
    completed_at?: string;
    error_message?: string;
}

interface ScrapingJob {
    id: number;
    status: string;
    category_name: string;
    items_scraped: number;
    started_at: string;
    completed_at?: string;
    error_message?: string;
}

interface CategoryStat {
    id: number;
    name: string;
    total_products: number;
    products_with_details: number;
    details_completion: number;
}

interface DetailedStats {
    categories: {
        total: number;
        with_products: number;
        completion: number;
    };
    products: {
        total: number;
        with_details: number;
        completion: number;
    };
    category_breakdown: CategoryStat[];
}

interface AdminPanelProps {
    status: ScrapingStatus | null;
    history: ScrapingJob[];
    isLoading: boolean;
    onStartScraping: () => void;
    onClearData: () => void;
    onRefresh: () => void;
}

export default function AdminPanel({
    status,
    history,
    isLoading,
    onStartScraping,
    onClearData,
    onRefresh
}: AdminPanelProps) {
    const [showHistory, setShowHistory] = useState(false);
    const [stats, setStats] = useState<DetailedStats | null>(null);
    const [showCategoryBreakdown, setShowCategoryBreakdown] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-800";
            case "running":
                return "bg-blue-100 text-blue-800";
            case "failed":
                return "bg-red-100 text-red-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString();
    };

    const fetchStats = async () => {
        try {
            const data = await api.get<DetailedStats>("/admin/stats");
            setStats(data);
        } catch (err) {
            console.error("Error fetching stats:", err);
            // Set empty stats to prevent UI errors
            setStats({
                categories: { total: 0, with_products: 0, completion: 0 },
                products: { total: 0, with_details: 0, completion: 0 },
                category_breakdown: []
            });
        }
    };

    // Fetch stats when component mounts and when refresh is called
    React.useEffect(() => {
        // Temporarily disabled - uncomment when backend is running
        // fetchStats();
    }, []);

    // Update onRefresh to also fetch stats
    const handleRefresh = () => {
        onRefresh();
        // fetchStats(); // Temporarily disabled
    };

    return (
        <div className="space-y-6">
            {/* Control Panel */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">Scraping Controls</h2>
                <div className="flex gap-4">
                    <button
                        onClick={onStartScraping}
                        disabled={isLoading}
                        className="px-6 py-3 bg-green-500 text-white font-semibold rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                    >
                        {isLoading ? "Scraping..." : "Start Scraping"}
                    </button>
                    <button
                        onClick={onClearData}
                        className="px-6 py-3 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition"
                    >
                        Clear All Data
                    </button>
                    <button
                        onClick={handleRefresh}
                        className="px-6 py-3 bg-gray-500 text-white font-semibold rounded hover:bg-gray-600 transition"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {/* Detailed Statistics */}
            {stats && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold mb-4">Scraping Statistics</h2>

                    {/* Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Categories Card */}
                        <div className="bg-blue-50 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-blue-800 mb-2">Categories</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Total Categories:</span>
                                    <span className="font-semibold">{stats.categories.total}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>With Products:</span>
                                    <span className="font-semibold">{stats.categories.with_products}</span>
                                </div>
                                <div className="w-full bg-blue-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${stats.categories.completion}%` }}
                                    ></div>
                                </div>
                                <div className="text-sm text-blue-600 font-semibold">
                                    {stats.categories.completion}% Complete
                                </div>
                            </div>
                        </div>

                        {/* Products Card */}
                        <div className="bg-green-50 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-green-800 mb-2">Products</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Total Products:</span>
                                    <span className="font-semibold">{stats.products.total}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>With Details:</span>
                                    <span className="font-semibold">{stats.products.with_details}</span>
                                </div>
                                <div className="w-full bg-green-200 rounded-full h-2">
                                    <div
                                        className="bg-green-600 h-2 rounded-full"
                                        style={{ width: `${stats.products.completion}%` }}
                                    ></div>
                                </div>
                                <div className="text-sm text-green-600 font-semibold">
                                    {stats.products.completion}% Details Scraped
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Category Breakdown */}
                    <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Category Breakdown</h3>
                            <button
                                onClick={() => setShowCategoryBreakdown(!showCategoryBreakdown)}
                                className="text-blue-500 hover:text-blue-700 font-semibold"
                            >
                                {showCategoryBreakdown ? "Hide" : "Show"}
                            </button>
                        </div>

                        {showCategoryBreakdown && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-2 text-left">Category</th>
                                            <th className="px-4 py-2 text-left">Products</th>
                                            <th className="px-4 py-2 text-left">Details Scraped</th>
                                            <th className="px-4 py-2 text-left">Progress</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.category_breakdown.length > 0 ? (
                                            stats.category_breakdown.map((cat) => (
                                                <tr key={cat.id} className="border-t hover:bg-gray-50">
                                                    <td className="px-4 py-2 font-medium">{cat.name}</td>
                                                    <td className="px-4 py-2">{cat.total_products}</td>
                                                    <td className="px-4 py-2">{cat.products_with_details}</td>
                                                    <td className="px-4 py-2">
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-16 bg-gray-200 rounded-full h-2">
                                                                <div
                                                                    className="bg-blue-600 h-2 rounded-full"
                                                                    style={{ width: `${cat.details_completion}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-xs font-semibold">
                                                                {cat.details_completion}%
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="px-4 py-2 text-center text-gray-500">
                                                    No categories found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Current Status */}
            {status && status.status !== "no_jobs" && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold mb-4">Current Status</h2>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <p className="text-gray-600">Status</p>
                            <p className={`text-lg font-semibold px-3 py-1 rounded w-fit ${getStatusColor(status.status)}`}>
                                {status.status.toUpperCase()}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600">Products Scraped</p>
                            <p className="text-lg font-semibold">{status.items_scraped}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Started At</p>
                            <p className="text-sm">{formatDate(status.started_at)}</p>
                        </div>
                        {status.completed_at && (
                            <div>
                                <p className="text-gray-600">Completed At</p>
                                <p className="text-sm">{formatDate(status.completed_at)}</p>
                            </div>
                        )}
                    </div>

                    {/* Scraping Levels */}
                    <div className="mt-6 pt-4 border-t">
                        <p className="font-semibold text-gray-700 mb-3">Scraping Levels</p>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <span className="text-green-600 mr-2">✓</span>
                                <span>Level 1: Categories</span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-green-600 mr-2">✓</span>
                                <span>Level 2: Product Lists</span>
                            </div>
                            <div className="flex items-center">
                                <span className={status.status === "completed" ? "text-green-600" : "text-blue-600"}>
                                    {status.status === "completed" ? "✓" : "⟳"}
                                </span>
                                <span className="ml-2">Level 3: Product Details</span>
                            </div>
                        </div>
                    </div>

                    {status.error_message && (
                        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded">
                            <p className="font-semibold">Error:</p>
                            <p>{status.error_message}</p>
                        </div>
                    )}
                </div>
            )}

            {/* History */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Scraping History</h2>
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className="text-blue-500 hover:text-blue-700 font-semibold"
                    >
                        {showHistory ? "Hide" : "Show"}
                    </button>
                </div>

                {showHistory && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-left">ID</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                    <th className="px-4 py-2 text-left">Items</th>
                                    <th className="px-4 py-2 text-left">Started</th>
                                    <th className="px-4 py-2 text-left">Completed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.length > 0 ? (
                                    history.map((job) => (
                                        <tr key={job.id} className="border-t hover:bg-gray-50">
                                            <td className="px-4 py-2">{job.id}</td>
                                            <td className="px-4 py-2">
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(job.status)}`}>
                                                    {job.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2">{job.items_scraped}</td>
                                            <td className="px-4 py-2 text-xs">{formatDate(job.started_at)}</td>
                                            <td className="px-4 py-2 text-xs">
                                                {job.completed_at ? formatDate(job.completed_at) : "-"}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-2 text-center text-gray-500">
                                            No scraping jobs yet
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
