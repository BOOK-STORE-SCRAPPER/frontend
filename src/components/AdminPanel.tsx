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

interface ScrapingLevelsStatus {
    level_1_categories: {
        status: string;
        scraped: boolean;
        count: number;
        message: string;
    };
    level_2_product_lists: {
        status: string;
        scraped: boolean;
        count: number;
        message: string;
    };
    level_3_product_details: {
        status: string;
        scraped: boolean;
        count: number;
        total_products: number;
        completion_percentage: number;
        message: string;
    };
    images: {
        status: string;
        scraped: boolean;
        count: number;
        total_products: number;
        completion_percentage: number;
        message: string;
    };
    summary: {
        all_levels_complete: boolean;
        overall_status: string;
    };
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
    const [levelsStatus, setLevelsStatus] = useState<ScrapingLevelsStatus | null>(null);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border border-emerald-200";
            case "running":
                return "bg-gradient-to-r from-sky-100 to-blue-100 text-sky-800 border border-sky-200";
            case "failed":
                return "bg-gradient-to-r from-rose-100 to-pink-100 text-rose-800 border border-rose-200";
            case "pending":
                return "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-200";
            default:
                return "bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 border border-slate-200";
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
            // Silently handle errors - backend might not be running
            if (err instanceof Error && !err.message.includes('not running')) {
                console.error("Error fetching stats:", err);
            }
            // Set empty stats to prevent UI errors
            setStats({
                categories: { total: 0, with_products: 0, completion: 0 },
                products: { total: 0, with_details: 0, completion: 0 },
                category_breakdown: []
            });
        }
    };

    const fetchLevelsStatus = async () => {
        try {
            const data = await api.get<ScrapingLevelsStatus>("/admin/scraping/levels-status");
            setLevelsStatus(data);
        } catch (err) {
            // Silently handle errors - backend might not be running
            if (err instanceof Error && !err.message.includes('not running')) {
                console.error("Error fetching levels status:", err);
            }
            // Keep levelsStatus as null to show loading state
        }
    };

    // Fetch stats and levels status when component mounts and when refresh is called
    React.useEffect(() => {
        fetchStats();
        fetchLevelsStatus();
    }, []);

    // Update onRefresh to also fetch stats and levels status
    const handleRefresh = () => {
        onRefresh();
        fetchStats();
        fetchLevelsStatus();
    };

    return (
        <div className="space-y-6">
            {/* Control Panel */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-violet-200/50 p-6">
                <h2 className="text-2xl font-bold mb-4 text-violet-800">Scraping Controls</h2>
                <div className="flex gap-4">
                    <button
                        onClick={onStartScraping}
                        disabled={isLoading}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-400 to-teal-400 text-white font-semibold rounded-lg hover:from-emerald-500 hover:to-teal-500 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        {isLoading ? "Scraping..." : "Start Scraping"}
                    </button>
                    <button
                        onClick={onClearData}
                        className="px-6 py-3 bg-gradient-to-r from-rose-400 to-pink-400 text-white font-semibold rounded-lg hover:from-rose-500 hover:to-pink-500 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        Clear All Data
                    </button>
                    <button
                        onClick={handleRefresh}
                        className="px-6 py-3 bg-gradient-to-r from-violet-400 to-purple-400 text-white font-semibold rounded-lg hover:from-violet-500 hover:to-purple-500 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {/* Detailed Statistics */}
            {stats && (
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-violet-200/50 p-6">
                    <h2 className="text-2xl font-bold mb-4 text-violet-800">Scraping Statistics</h2>

                    {/* Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Categories Card */}
                        <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-5 border border-sky-200/50 shadow-sm">
                            <h3 className="text-lg font-semibold text-sky-800 mb-3">Categories</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sky-700">
                                    <span>Total Categories:</span>
                                    <span className="font-semibold">{stats.categories.total}</span>
                                </div>
                                <div className="flex justify-between text-sky-700">
                                    <span>With Products:</span>
                                    <span className="font-semibold">{stats.categories.with_products}</span>
                                </div>
                                <div className="w-full bg-sky-200/60 rounded-full h-3 mt-3">
                                    <div
                                        className="bg-gradient-to-r from-sky-400 to-blue-400 h-3 rounded-full transition-all duration-300"
                                        style={{ width: `${stats.categories.completion}%` }}
                                    ></div>
                                </div>
                                <div className="text-sm text-sky-700 font-semibold mt-2">
                                    {stats.categories.completion}% Complete
                                </div>
                            </div>
                        </div>

                        {/* Products Card */}
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-200/50 shadow-sm">
                            <h3 className="text-lg font-semibold text-emerald-800 mb-3">Products</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between text-emerald-700">
                                    <span>Total Products:</span>
                                    <span className="font-semibold">{stats.products.total}</span>
                                </div>
                                <div className="flex justify-between text-emerald-700">
                                    <span>With Details:</span>
                                    <span className="font-semibold">{stats.products.with_details}</span>
                                </div>
                                <div className="w-full bg-emerald-200/60 rounded-full h-3 mt-3">
                                    <div
                                        className="bg-gradient-to-r from-emerald-400 to-teal-400 h-3 rounded-full transition-all duration-300"
                                        style={{ width: `${stats.products.completion}%` }}
                                    ></div>
                                </div>
                                <div className="text-sm text-emerald-700 font-semibold mt-2">
                                    {stats.products.completion}% Details Scraped
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Category Breakdown */}
                    <div className="border-t border-violet-200/50 pt-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-violet-800">Category Breakdown</h3>
                            <button
                                onClick={() => setShowCategoryBreakdown(!showCategoryBreakdown)}
                                className="text-violet-600 hover:text-violet-800 font-semibold px-3 py-1 rounded-lg hover:bg-violet-50 transition"
                            >
                                {showCategoryBreakdown ? "Hide" : "Show"}
                            </button>
                        </div>

                        {showCategoryBreakdown && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gradient-to-r from-violet-50 to-purple-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-violet-800">Category</th>
                                            <th className="px-4 py-2 text-left text-violet-800">Products</th>
                                            <th className="px-4 py-2 text-left text-violet-800">Details Scraped</th>
                                            <th className="px-4 py-2 text-left text-violet-800">Progress</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.category_breakdown.length > 0 ? (
                                            stats.category_breakdown.map((cat) => (
                                                <tr key={cat.id} className="border-t border-violet-100/50 hover:bg-gradient-to-r hover:from-violet-50/50 hover:to-purple-50/50 transition">
                                                    <td className="px-4 py-2 font-medium text-violet-900">{cat.name}</td>
                                                    <td className="px-4 py-2 text-violet-700">{cat.total_products}</td>
                                                    <td className="px-4 py-2 text-violet-700">{cat.products_with_details}</td>
                                                    <td className="px-4 py-2">
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-16 bg-violet-200/40 rounded-full h-2">
                                                                <div
                                                                    className="bg-gradient-to-r from-violet-400 to-purple-400 h-2 rounded-full transition-all duration-300"
                                                                    style={{ width: `${cat.details_completion}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-xs font-semibold text-violet-700">
                                                                {cat.details_completion}%
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="px-4 py-2 text-center text-violet-500">
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

            {/* Scraping Levels Status - Always visible */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-violet-200/50 p-6">
                <h2 className="text-2xl font-bold mb-4 text-violet-800">Scraping Levels Status</h2>
                {levelsStatus ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-50/50 to-purple-50/50 rounded-xl border border-violet-200/50">
                            <div className="flex items-center">
                                <span className={`mr-3 text-2xl font-bold ${levelsStatus.level_1_categories.scraped ? "text-emerald-600" : "text-rose-600"}`}>
                                    {levelsStatus.level_1_categories.scraped ? "✓" : "✗"}
                                </span>
                                <span className="text-lg font-semibold text-violet-800">Level 1: Categories</span>
                            </div>
                            <span className="text-sm text-violet-600">{levelsStatus.level_1_categories.message}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-50/50 to-purple-50/50 rounded-xl border border-violet-200/50">
                            <div className="flex items-center">
                                <span className={`mr-3 text-2xl font-bold ${levelsStatus.level_2_product_lists.scraped ? "text-emerald-600" : "text-rose-600"}`}>
                                    {levelsStatus.level_2_product_lists.scraped ? "✓" : "✗"}
                                </span>
                                <span className="text-lg font-semibold text-violet-800">Level 2: Product Lists</span>
                            </div>
                            <span className="text-sm text-violet-600">{levelsStatus.level_2_product_lists.message}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-50/50 to-purple-50/50 rounded-xl border border-violet-200/50">
                            <div className="flex items-center">
                                <span className={`mr-3 text-2xl font-bold ${levelsStatus.level_3_product_details.scraped ? "text-emerald-600" : "text-rose-600"}`}>
                                    {levelsStatus.level_3_product_details.scraped ? "✓" : "✗"}
                                </span>
                                <span className="text-lg font-semibold text-violet-800">Level 3: Product Details</span>
                            </div>
                            <span className="text-sm text-violet-600">{levelsStatus.level_3_product_details.message}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-50/50 to-purple-50/50 rounded-xl border border-violet-200/50">
                            <div className="flex items-center">
                                <span className={`mr-3 text-2xl font-bold ${levelsStatus.images.scraped ? "text-emerald-600" : "text-rose-600"}`}>
                                    {levelsStatus.images.scraped ? "✓" : "✗"}
                                </span>
                                <span className="text-lg font-semibold text-violet-800">Images</span>
                            </div>
                            <span className="text-sm text-violet-600">{levelsStatus.images.message}</span>
                        </div>
                        {levelsStatus.summary && (
                            <div className="mt-4 p-4 bg-gradient-to-r from-sky-50 to-indigo-50 rounded-xl border-l-4 border-sky-400">
                                <p className={`font-semibold ${levelsStatus.summary.all_levels_complete ? "text-emerald-700" : "text-amber-700"}`}>
                                    {levelsStatus.summary.overall_status}
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-center p-4 bg-gradient-to-r from-violet-50/30 to-purple-50/30 rounded-xl border border-violet-200/30">
                            <span className="text-violet-300 mr-3 text-2xl">-</span>
                            <span className="text-violet-500 text-lg">Level 1: Categories</span>
                        </div>
                        <div className="flex items-center p-4 bg-gradient-to-r from-violet-50/30 to-purple-50/30 rounded-xl border border-violet-200/30">
                            <span className="text-violet-300 mr-3 text-2xl">-</span>
                            <span className="text-violet-500 text-lg">Level 2: Product Lists</span>
                        </div>
                        <div className="flex items-center p-4 bg-gradient-to-r from-violet-50/30 to-purple-50/30 rounded-xl border border-violet-200/30">
                            <span className="text-violet-300 mr-3 text-2xl">-</span>
                            <span className="text-violet-500 text-lg">Level 3: Product Details</span>
                        </div>
                        <div className="flex items-center p-4 bg-gradient-to-r from-violet-50/30 to-purple-50/30 rounded-xl border border-violet-200/30">
                            <span className="text-violet-300 mr-3 text-2xl">-</span>
                            <span className="text-violet-500 text-lg">Images</span>
                        </div>
                        <p className="text-sm text-violet-500 mt-2">Loading status...</p>
                    </div>
                )}
            </div>

            {/* Current Status */}
            {status && status.status !== "no_jobs" && (
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-violet-200/50 p-6">
                    <h2 className="text-2xl font-bold mb-4 text-violet-800">Current Scraping Job</h2>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <p className="text-violet-600 font-medium mb-1">Status</p>
                            <p className={`text-lg font-semibold px-4 py-2 rounded-lg w-fit ${getStatusColor(status.status)}`}>
                                {status.status.toUpperCase()}
                            </p>
                        </div>
                        <div>
                            <p className="text-violet-600 font-medium mb-1">Products Scraped</p>
                            <p className="text-lg font-semibold text-violet-800">{status.items_scraped}</p>
                        </div>

                        <div>
                            <p className="text-violet-600 font-medium mb-1">Started At</p>
                            <p className="text-sm text-violet-700">{formatDate(status.started_at)}</p>
                        </div>
                        {status.completed_at && (
                            <div>
                                <p className="text-violet-600 font-medium mb-1">Completed At</p>
                                <p className="text-sm text-violet-700">{formatDate(status.completed_at)}</p>
                            </div>
                        )}
                    </div>

                    {status.error_message && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-rose-50 to-pink-50 text-rose-800 rounded-xl border-l-4 border-rose-400">
                            <p className="font-semibold mb-1">Error:</p>
                            <p>{status.error_message}</p>
                        </div>
                    )}
                </div>
            )}

            {/* History */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-violet-200/50 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-violet-800">Scraping History</h2>
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className="text-violet-600 hover:text-violet-800 font-semibold px-3 py-1 rounded-lg hover:bg-violet-50 transition"
                    >
                        {showHistory ? "Hide" : "Show"}
                    </button>
                </div>

                {showHistory && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gradient-to-r from-violet-50 to-purple-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-violet-800">ID</th>
                                    <th className="px-4 py-2 text-left text-violet-800">Status</th>
                                    <th className="px-4 py-2 text-left text-violet-800">Items</th>
                                    <th className="px-4 py-2 text-left text-violet-800">Started</th>
                                    <th className="px-4 py-2 text-left text-violet-800">Completed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.length > 0 ? (
                                    history.map((job) => (
                                        <tr key={job.id} className="border-t border-violet-100/50 hover:bg-gradient-to-r hover:from-violet-50/50 hover:to-purple-50/50 transition">
                                            <td className="px-4 py-2 text-violet-700">{job.id}</td>
                                            <td className="px-4 py-2">
                                                <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(job.status)}`}>
                                                    {job.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 text-violet-700">{job.items_scraped}</td>
                                            <td className="px-4 py-2 text-xs text-violet-600">{formatDate(job.started_at)}</td>
                                            <td className="px-4 py-2 text-xs text-violet-600">
                                                {job.completed_at ? formatDate(job.completed_at) : "-"}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-2 text-center text-violet-500">
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
