"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="bg-gray-800 border-b border-gray-700 shadow-lg">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        {/* Three Stacked Books Logo */}
                        <div className="flex flex-col items-center gap-0.5">
                            <div className="w-6 h-4 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-sm shadow-md"></div>
                            <div className="w-6 h-4 bg-gradient-to-br from-rose-400 to-rose-500 rounded-sm shadow-md"></div>
                            <div className="w-6 h-4 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-sm shadow-md"></div>
                        </div>
                        <h1 className="text-2xl font-bold text-white">
                            Book Store Scraper
                        </h1>
                    </Link>
                    
                    <div className="flex items-center gap-6">
                        <Link 
                            href="/"
                            className={`text-sm font-semibold transition-colors ${
                                isActive("/")
                                    ? "text-white border-b-2 border-white pb-1"
                                    : "text-gray-300 hover:text-white"
                            }`}
                        >
                            Home
                        </Link>
                        <Link 
                            href="/dev-status"
                            className={`text-sm font-semibold transition-colors ${
                                isActive("/dev-status")
                                    ? "text-white border-b-2 border-white pb-1"
                                    : "text-gray-300 hover:text-white"
                            }`}
                        >
                            Dev Status
                        </Link>
                        <Link 
                            href="/admin"
                            className={`text-sm font-semibold transition-colors ${
                                isActive("/admin")
                                    ? "text-white border-b-2 border-white pb-1"
                                    : "text-gray-300 hover:text-white"
                            }`}
                        >
                            Admin
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

