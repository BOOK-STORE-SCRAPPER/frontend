import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Book Store Scraper",
  description: "Web scraper for extracting book data from books.toscrape.com",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="bg-white dark:bg-gray-800 shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">📚 Book Store Scraper</h1>
            <div className="flex gap-4">
              <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
                Home
              </Link>
              <Link href="/dev-status" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
                Dev Status
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
