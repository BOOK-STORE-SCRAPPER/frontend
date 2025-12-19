"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navigation from "../../components/Navigation";
import { api } from "../../lib/api";

interface HealthStatus {
    status: string;
    timestamp?: string;
    version?: string;
}

interface SystemInfo {
    apiUrl: string;
    frontendUrl: string;
    nodeVersion?: string;
    nextVersion?: string;
    reactVersion?: string;
}

export default function DevStatusPage() {
    const [backendHealth, setBackendHealth] = useState<HealthStatus | null>(null);
    const [backendConnected, setBackendConnected] = useState<boolean | null>(null);
    const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastChecked, setLastChecked] = useState<Date | null>(null);

    const checkBackendHealth = async () => {
        try {
            const health = await api.get<HealthStatus>("/health");
            setBackendHealth(health);
            setBackendConnected(true);
            setLastChecked(new Date());
        } catch (err) {
            setBackendHealth(null);
            if (err instanceof TypeError) {
                setBackendConnected(false);
            } else {
                setBackendConnected(true);
            }
            setLastChecked(new Date());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Get system information
        const info: SystemInfo = {
            apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
            frontendUrl: typeof window !== 'undefined' ? window.location.origin : 'N/A',
            nodeVersion: typeof process !== 'undefined' ? process.version : undefined,
        };
        setSystemInfo(info);

        // Check backend health
        checkBackendHealth();
    }, []);

    const getStatusColor = (connected: boolean | null) => {
        if (connected === true) return "bg-green-500";
        if (connected === false) return "bg-red-500";
        return "bg-gray-400";
    };

    const getStatusText = (connected: boolean | null) => {
        if (connected === true) return "Connected";
        if (connected === false) return "Disconnected";
        return "Checking...";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50/30 via-blue-50/20 to-indigo-50/30">
            <Navigation />
            
            <div className="p-6 max-w-6xl mx-auto space-y-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-sky-800">Development Status</h2>
                    <button
                        onClick={checkBackendHealth}
                        disabled={loading}
                        className="px-5 py-2.5 bg-gradient-to-r from-sky-400 to-blue-400 text-white rounded-lg font-medium hover:from-sky-500 hover:to-blue-500 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                    >
                        {loading ? "Checking..." : "Refresh Status"}
                    </button>
                </div>
                {/* Backend Connection Status */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-sky-200/50 p-6">
                    <h2 className="text-2xl font-bold mb-4">Backend Connection</h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className={`w-4 h-4 rounded-full ${getStatusColor(backendConnected)}`}></div>
                            <span className="text-lg font-semibold">{getStatusText(backendConnected)}</span>
                        </div>
                        {systemInfo && (
                            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-lg p-4 border border-sky-200/50">
                                <p className="text-sm text-gray-600 mb-2">API URL:</p>
                                <p className="font-mono text-sm bg-white p-2 rounded border">
                                    {systemInfo.apiUrl}
                                </p>
                            </div>
                        )}
                        {backendHealth && (
                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border-l-4 border-emerald-400">
                                <p className="font-semibold text-green-800 mb-2">Backend Health Check:</p>
                                <div className="space-y-1 text-sm">
                                    <p><span className="font-semibold">Status:</span> {backendHealth.status}</p>
                                    {backendHealth.version && (
                                        <p><span className="font-semibold">Version:</span> {backendHealth.version}</p>
                                    )}
                                    {backendHealth.timestamp && (
                                        <p><span className="font-semibold">Timestamp:</span> {new Date(backendHealth.timestamp).toLocaleString()}</p>
                                    )}
                                </div>
                            </div>
                        )}
                        {backendConnected === false && (
                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-400">
                                <p className="font-semibold text-yellow-800 mb-2">⚠️ Backend Not Available</p>
                                <p className="text-sm text-yellow-700">
                                    The backend server is not running or not accessible. Please ensure:
                                </p>
                                <ul className="list-disc list-inside text-sm text-yellow-700 mt-2 space-y-1">
                                    <li>Backend server is running on {systemInfo?.apiUrl}</li>
                                    <li>CORS is configured to allow requests from {systemInfo?.frontendUrl}</li>
                                    <li>Check the backend logs for any errors</li>
                                </ul>
                            </div>
                        )}
                        {lastChecked && (
                            <p className="text-xs text-gray-500">
                                Last checked: {lastChecked.toLocaleString()}
                            </p>
                        )}
                    </div>
                </div>

                {/* System Information */}
                {systemInfo && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-sky-200/50 p-6">
                        <h2 className="text-2xl font-bold mb-4">System Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-lg p-4 border border-sky-200/50">
                                <p className="text-sm text-gray-600 mb-1">Frontend URL</p>
                                <p className="font-mono text-sm">{systemInfo.frontendUrl}</p>
                            </div>
                            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-lg p-4 border border-sky-200/50">
                                <p className="text-sm text-gray-600 mb-1">Backend API URL</p>
                                <p className="font-mono text-sm">{systemInfo.apiUrl}</p>
                            </div>
                            {systemInfo.nodeVersion && (
                                <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-lg p-4 border border-sky-200/50">
                                    <p className="text-sm text-gray-600 mb-1">Node.js Version</p>
                                    <p className="font-mono text-sm">{systemInfo.nodeVersion}</p>
                                </div>
                            )}
                            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-lg p-4 border border-sky-200/50">
                                <p className="text-sm text-gray-600 mb-1">Next.js Version</p>
                                <p className="font-mono text-sm">16.0.10</p>
                            </div>
                            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-lg p-4 border border-sky-200/50">
                                <p className="text-sm text-gray-600 mb-1">React Version</p>
                                <p className="font-mono text-sm">19.2.1</p>
                            </div>
                            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-lg p-4 border border-sky-200/50">
                                <p className="text-sm text-gray-600 mb-1">Environment</p>
                                <p className="font-mono text-sm">
                                    {process.env.NODE_ENV || 'development'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Links */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-sky-200/50 p-6">
                    <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link href="/">
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 hover:from-amber-100 hover:to-orange-100 transition-all duration-200 cursor-pointer border border-amber-200/50 shadow-sm hover:shadow-md">
                                <h3 className="font-semibold text-amber-800 mb-1">📚 Home</h3>
                                <p className="text-sm text-amber-700">View books and categories</p>
                            </div>
                        </Link>
                        <Link href="/admin">
                            <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-lg p-4 hover:from-violet-100 hover:to-purple-100 transition-all duration-200 cursor-pointer border border-violet-200/50 shadow-sm hover:shadow-md">
                                <h3 className="font-semibold text-violet-800 mb-1">⚙️ Admin Panel</h3>
                                <p className="text-sm text-violet-700">Manage scraping and data</p>
                            </div>
                        </Link>
                        <a href={systemInfo?.apiUrl || '#'} target="_blank" rel="noopener noreferrer">
                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-4 hover:from-emerald-100 hover:to-teal-100 transition-all duration-200 cursor-pointer border border-emerald-200/50 shadow-sm hover:shadow-md">
                                <h3 className="font-semibold text-emerald-800 mb-1">🔗 Backend API</h3>
                                <p className="text-sm text-emerald-700">Open backend in new tab</p>
                            </div>
                        </a>
                    </div>
                </div>

                {/* Environment Variables Info */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-sky-200/50 p-6">
                    <h2 className="text-2xl font-bold mb-4">Environment Configuration</h2>
                    <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-lg p-4 border border-sky-200/50">
                        <p className="text-sm text-gray-600 mb-2">
                            Environment variables are loaded from <code className="bg-gray-200 px-2 py-1 rounded">.env.local</code>
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold">NEXT_PUBLIC_API_URL:</span>
                                <span className="font-mono text-sm bg-white px-2 py-1 rounded border">
                                    {process.env.NEXT_PUBLIC_API_URL || 'Not set (default: http://localhost:8000)'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold">NODE_ENV:</span>
                                <span className="font-mono text-sm bg-white px-2 py-1 rounded border">
                                    {process.env.NODE_ENV || 'development'}
                                </span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-4">
                            Note: Only variables prefixed with <code className="bg-gray-200 px-1 rounded">NEXT_PUBLIC_</code> are exposed to the browser.
                        </p>
                    </div>
                </div>

                {/* Development Tips */}
                <div className="bg-gradient-to-r from-sky-50 to-indigo-50 rounded-xl shadow-sm border-l-4 border-sky-400 p-6">
                    <h2 className="text-xl font-bold mb-3 text-blue-800">💡 Development Tips</h2>
                    <ul className="space-y-2 text-sm text-blue-700">
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Use <code className="bg-blue-100 px-1 rounded">npm run dev</code> to start the development server</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Check browser console for API errors and network issues</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Ensure backend is running before testing API connections</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Use the Admin Panel to start scraping and manage data</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Refresh this page to check backend connection status</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

