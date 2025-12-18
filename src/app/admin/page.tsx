"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminPanel from "../../components/AdminPanel";
import { api } from "../../lib/api";

export default function AdminPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [autoRefresh, setAutoRefresh] = useState(false);

    const fetchStatus = async () => {
        try {
            const data = await api.get<any>("/admin/scrape/status");
            setStatus(data);
        } catch (err) {
            console.error("Error fetching status:", err);
        }
    };

    const fetchHistory = async () => {
        try {
            const data = await api.get<{ jobs: any[] }>("/admin/scrape/history");
            setHistory(data.jobs || []);
        } catch (err) {
            console.error("Error fetching history:", err);
        }
    };

    useEffect(() => {
        // Initial load only - no automatic polling
        fetchStatus();
        fetchHistory();
    }, []);

    // Separate effect for auto-refresh (only when enabled)
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (autoRefresh && (status?.status === "running" || status?.status === "pending")) {
            interval = setInterval(fetchStatus, 2000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [status?.status, autoRefresh]);

    const handleStartScraping = async () => {
        setIsLoading(true);
        try {
            const data = await api.post<any>("/admin/scrape/start", { base_url: "http://books.toscrape.com" });
            setStatus(data);
            fetchHistory();
        } catch (err) {
            console.error("Error starting scraping:", err);
            alert("Failed to start scraping");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearData = async () => {
        if (!confirm("Are you sure you want to clear all data?")) return;

        try {
            await api.delete("/admin/data/clear");

            setStatus(null);
            setHistory([]);
            alert("Data cleared successfully");
        } catch (err) {
            console.error("Error clearing data:", err);
            alert("Failed to clear data");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white border-b">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={autoRefresh}
                                    onChange={(e) => setAutoRefresh(e.target.checked)}
                                    className="rounded"
                                />
                                Auto-refresh
                            </label>
                            <Link href="/">
                                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                    Back to App
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 max-w-6xl mx-auto">
                <AdminPanel
                    status={status}
                    history={history}
                    isLoading={isLoading}
                    onStartScraping={handleStartScraping}
                    onClearData={handleClearData}
                    onRefresh={() => {
                        fetchStatus();
                        fetchHistory();
                    }}
                />
            </div>
        </div>
    );
}
