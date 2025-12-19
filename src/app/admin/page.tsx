"use client";

import { useState, useEffect } from "react";
import Navigation from "../../components/Navigation";
import AdminPanel from "../../components/AdminPanel";
import { api } from "../../lib/api";

export default function AdminPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [backendConnected, setBackendConnected] = useState<boolean | null>(null);

    const checkBackendConnection = async () => {
        try {
            // Use the api.get method which handles errors properly
            await api.get("/health");
            setBackendConnected(true);
            return true;
        } catch (err) {
            // If it's a network error, backend might not be running
            // But don't set it to false immediately - it could be a temporary issue
            // Only set to false if it's clearly a connection error
            if (err instanceof TypeError) {
                setBackendConnected(false);
                return false;
            }
            // For other errors (like 404, 500), backend IS running but endpoint failed
            // So we consider it connected
            setBackendConnected(true);
            return true;
        }
    };

    const fetchStatus = async () => {
        try {
            const data = await api.get<any>("/admin/scrape/status");
            setStatus(data);
            setBackendConnected(true);
        } catch (err) {
            // Only set backendConnected to false if it's a network error (TypeError)
            // Other errors (404, 500, etc.) mean backend IS running
            if (err instanceof TypeError) {
                setBackendConnected(false);
            } else {
                // Backend is running but endpoint returned an error
                setBackendConnected(true);
            }
            // Set status to null on any error
            setStatus(null);
            // Only log non-network errors
            if (!(err instanceof TypeError)) {
                console.error("Error fetching status:", err);
            }
        }
    };

    const fetchHistory = async () => {
        try {
            const data = await api.get<{ jobs: any[] }>("/admin/scrape/history");
            setHistory(data.jobs || []);
            setBackendConnected(true);
        } catch (err) {
            // Only set backendConnected to false if it's a network error (TypeError)
            // Other errors (404, 500, etc.) mean backend IS running
            if (err instanceof TypeError) {
                setBackendConnected(false);
            } else {
                // Backend is running but endpoint returned an error
                setBackendConnected(true);
            }
            // Set empty array on error
            setHistory([]);
            // Only log non-network errors
            if (!(err instanceof TypeError)) {
                console.error("Error fetching history:", err);
            }
        }
    };

    useEffect(() => {
        // Try to fetch data - if it fails, connection check will handle it
        const loadData = async () => {
            // Try fetching status first - if it works, backend is connected
            try {
                await fetchStatus();
                await fetchHistory();
            } catch (err) {
                // If fetchStatus fails, check connection explicitly
                await checkBackendConnection();
            }
        };
        loadData();
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
        // Check backend connection first
        const connected = await checkBackendConnection();
        if (!connected) {
            alert("Backend server is not running. Please start the backend server first.");
            return;
        }

        setIsLoading(true);
        try {
            const data = await api.post<any>("/admin/scrape/start", { base_url: "http://books.toscrape.com" });
            setStatus(data);
            fetchHistory();
        } catch (err) {
            console.error("Error starting scraping:", err);
            const errorMessage = err instanceof Error ? err.message : "Failed to start scraping";
            alert(errorMessage.includes('not running') ? "Backend server is not running. Please start the backend server first." : "Failed to start scraping");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearData = async () => {
        if (!confirm("Are you sure you want to clear all data?")) return;

        // Check backend connection first
        const connected = await checkBackendConnection();
        if (!connected) {
            alert("Backend server is not running. Please start the backend server first.");
            return;
        }

        try {
            await api.delete("/admin/data/clear");

            setStatus(null);
            setHistory([]);
            alert("Data cleared successfully");
        } catch (err) {
            console.error("Error clearing data:", err);
            const errorMessage = err instanceof Error ? err.message : "Failed to clear data";
            alert(errorMessage.includes('not running') ? "Backend server is not running." : "Failed to clear data");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50/30 via-purple-50/20 to-fuchsia-50/30">
            <Navigation />
            
            <div className="p-6 max-w-7xl mx-auto">
                {/* Backend Status Banner */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-violet-200/50 shadow-sm">
                            <div className={`w-3 h-3 rounded-full ${backendConnected === true ? 'bg-emerald-500' : backendConnected === false ? 'bg-rose-500' : 'bg-amber-400'}`}></div>
                            <span className={`text-sm font-medium ${backendConnected === false ? 'text-rose-700' : backendConnected === true ? 'text-emerald-700' : 'text-amber-700'}`}>
                                {backendConnected === true ? 'Backend Connected' : backendConnected === false ? 'Backend Offline' : 'Checking...'}
                            </span>
                        </div>
                        <label className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-violet-200/50 shadow-sm cursor-pointer hover:bg-violet-50/50 transition">
                            <input
                                type="checkbox"
                                checked={autoRefresh}
                                onChange={(e) => setAutoRefresh(e.target.checked)}
                                className="rounded text-violet-600 focus:ring-violet-500"
                            />
                            <span className="text-sm font-medium text-violet-700">Auto-refresh</span>
                        </label>
                    </div>
                </div>

                {backendConnected === false && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 rounded-lg shadow-sm">
                        <p className="text-amber-800 font-semibold">⚠️ Backend server is not running</p>
                        <p className="text-amber-700 text-sm mt-1">
                            Please start the backend server: <code className="bg-amber-100 px-2 py-1 rounded text-amber-800">cd backend && uvicorn app.main:app --reload</code>
                        </p>
                    </div>
                )}

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
