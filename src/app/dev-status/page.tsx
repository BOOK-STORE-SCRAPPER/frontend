'use client';

import { useState } from 'react';

interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    category: string;
}

const tasks: Task[] = [
    // Backend Infrastructure
    { id: 'fastapi-setup', title: 'FastAPI Setup', description: 'Core API framework and routing', completed: true, category: 'backend' },
    { id: 'database-models', title: 'Database Models', description: 'SQLite/PostgreSQL schema and ORM', completed: true, category: 'backend' },
    { id: 'cors-middleware', title: 'CORS Middleware', description: 'Frontend-backend communication', completed: true, category: 'backend' },
    { id: 'docker-setup', title: 'Docker Setup', description: 'Containerization with Makefile', completed: true, category: 'backend' },
    { id: 'error-handling', title: 'Error Handling', description: 'Comprehensive error responses', completed: false, category: 'backend' },
    { id: 'logging-system', title: 'Logging System', description: 'Request/response logging', completed: false, category: 'backend' },

    // Scraping Features
    { id: 'category-scraper', title: 'Category Scraper', description: 'Extract all book categories', completed: true, category: 'scraping' },
    { id: 'book-list-scraper', title: 'Book List Scraper', description: 'Scrape books by category with pagination', completed: true, category: 'scraping' },
    { id: 'book-details-scraper', title: 'Book Details Scraper', description: 'Extract description, UPC, price, availability', completed: true, category: 'scraping' },
    { id: 'book-details-endpoint', title: 'Book Details Endpoint', description: 'POST /scrape/book/{id} endpoint', completed: true, category: 'scraping' },
    { id: 'image-download', title: 'Image Download', description: 'Download and store book cover images', completed: true, category: 'scraping' },
    { id: 'json-export', title: 'JSON Export', description: 'Generate JSON files from scraped data', completed: true, category: 'scraping' },
    { id: 'pagination-handling', title: 'Pagination Handling', description: 'Handle multi-page category scraping', completed: true, category: 'scraping' },
    { id: 'rate-limiting', title: 'Rate Limiting', description: 'Respectful scraping with delays', completed: false, category: 'scraping' },
    { id: 'retry-logic', title: 'Retry Logic', description: 'Handle failed requests gracefully', completed: false, category: 'scraping' },

    // Frontend UI
    { id: 'next-setup', title: 'Next.js Setup', description: 'Project structure and configuration', completed: true, category: 'frontend' },
    { id: 'tailwind-setup', title: 'Tailwind CSS Setup', description: 'Styling framework configured', completed: true, category: 'frontend' },
    { id: 'layout-component', title: 'Layout Component', description: 'Root layout and navigation', completed: true, category: 'frontend' },
    { id: 'category-list', title: 'Category List UI', description: 'Display all book categories', completed: true, category: 'frontend' },
    { id: 'book-grid', title: 'Book Table Display', description: 'Show books in table format with item #', completed: true, category: 'frontend' },
    { id: 'book-detail-page', title: 'Book Detail Page', description: 'Individual book information view', completed: false, category: 'frontend' },
    { id: 'search-component', title: 'Search Component', description: 'Search books by title/author', completed: false, category: 'frontend' },
    { id: 'filter-component', title: 'Filter Component', description: 'Filter by category, price, rating', completed: false, category: 'frontend' },
    { id: 'stats-box', title: 'Stats Box', description: 'Real-time category and book count display', completed: true, category: 'frontend' },
    { id: 'auto-refetch', title: 'Auto-Refetch Mechanism', description: 'Auto-update UI after scraping', completed: true, category: 'frontend' },

    // API Integration
    { id: 'api-client', title: 'API Client Setup', description: 'HTTP client for backend communication', completed: true, category: 'integration' },
    { id: 'fetch-categories', title: 'Fetch Categories', description: 'Load categories from backend', completed: true, category: 'integration' },
    { id: 'fetch-books', title: 'Fetch Books', description: 'Load books by category', completed: true, category: 'integration' },
    { id: 'fetch-book-details', title: 'Fetch Book Details', description: 'Load individual book information', completed: false, category: 'integration' },
    { id: 'error-handling-ui', title: 'Error Handling UI', description: 'Display error messages to users', completed: true, category: 'integration' },
    { id: 'loading-states', title: 'Loading States', description: 'Show loading indicators', completed: true, category: 'integration' },

    // Data Management
    { id: 'categories-data', title: 'Categories Data', description: '51 book categories scraped', completed: true, category: 'data' },
    { id: 'romance-data', title: 'Romance Category Data', description: 'Sample romance books dataset', completed: true, category: 'data' },
    { id: 'religion-data', title: 'Religion Category Data', description: 'Sample religion books dataset', completed: true, category: 'data' },
    { id: 'database-seeding', title: 'Database Seeding', description: 'Populate DB with initial data', completed: false, category: 'data' },
    { id: 'data-caching', title: 'Data Caching', description: 'Cache frequently accessed data', completed: false, category: 'data' },

    // Advanced Features
    { id: 'sorting', title: 'Sorting', description: 'Sort books by price, rating, date', completed: false, category: 'advanced' },
    { id: 'pagination-ui', title: 'Pagination UI', description: 'Navigate through large datasets', completed: false, category: 'advanced' },
    { id: 'favorites', title: 'Favorites System', description: 'Save favorite books', completed: false, category: 'advanced' },
    { id: 'wishlist', title: 'Wishlist', description: 'Create and manage wishlists', completed: false, category: 'advanced' },
    { id: 'reviews', title: 'Reviews System', description: 'User reviews and ratings', completed: false, category: 'advanced' },
    { id: 'recommendations', title: 'Recommendations', description: 'Suggest similar books', completed: false, category: 'advanced' },

    // Testing & Quality
    { id: 'unit-tests-backend', title: 'Unit Tests (Backend)', description: 'Test scraper functions', completed: false, category: 'testing' },
    { id: 'integration-tests', title: 'Integration Tests', description: 'Test API endpoints', completed: false, category: 'testing' },
    { id: 'e2e-tests', title: 'E2E Tests', description: 'End-to-end user flows', completed: false, category: 'testing' },
    { id: 'performance-testing', title: 'Performance Testing', description: 'Load and stress testing', completed: false, category: 'testing' },

    // Deployment & DevOps
    { id: 'ci-cd-pipeline', title: 'CI/CD Pipeline', description: 'Automated testing and deployment', completed: false, category: 'devops' },
    { id: 'production-deployment', title: 'Production Deployment', description: 'Deploy to production environment', completed: false, category: 'devops' },
    { id: 'monitoring', title: 'Monitoring', description: 'Application health and performance monitoring', completed: false, category: 'devops' },
    { id: 'backup-strategy', title: 'Backup Strategy', description: 'Database and data backups', completed: false, category: 'devops' },
];

const categoryColors: Record<string, string> = {
    backend: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    scraping: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    frontend: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    integration: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    data: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    advanced: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    testing: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    devops: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
};

const categoryNames: Record<string, string> = {
    backend: 'Backend Infrastructure',
    scraping: 'Scraping Features',
    frontend: 'Frontend UI',
    integration: 'API Integration',
    data: 'Data Management',
    advanced: 'Advanced Features',
    testing: 'Testing & Quality',
    devops: 'Deployment & DevOps',
};

export default function DevelopmentStatus() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const categories = Object.keys(categoryNames) as Array<keyof typeof categoryNames>;
    const filteredTasks = selectedCategory === 'all' ? tasks : tasks.filter(task => task.category === selectedCategory);
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progressPercentage = Math.round((completedTasks / totalTasks) * 100);

    const getTasksByCategory = (category: string) => {
        return tasks.filter(task => task.category === category);
    };

    const getCompletedTasksByCategory = (category: string) => {
        return tasks.filter(task => task.category === category && task.completed).length;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">📊 Development Status</h1>
                    <p className="text-gray-600 dark:text-gray-400">Track the progress of the Book Store Scraper project</p>
                </div>

                {/* Product Overview */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg shadow-lg p-8 mb-8 border border-emerald-200 dark:border-emerald-800">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">📚 What is Book Store Scraper?</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* What It Does */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">What It Does</h3>
                            <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                                <li className="flex items-start">
                                    <span className="text-emerald-500 font-bold mr-3">•</span>
                                    <span><strong>Scrapes Books:</strong> Automatically extracts book data from books.toscrape.com</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-emerald-500 font-bold mr-3">•</span>
                                    <span><strong>Collects Categories:</strong> Gathers all 51 book categories (Romance, Fiction, Science, etc.)</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-emerald-500 font-bold mr-3">•</span>
                                    <span><strong>Extracts Details:</strong> Gets title, price, availability, description, UPC, and images</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-emerald-500 font-bold mr-3">•</span>
                                    <span><strong>Stores Data:</strong> Saves everything in database or JSON files</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-emerald-500 font-bold mr-3">•</span>
                                    <span><strong>Downloads Images:</strong> Automatically saves book cover images locally</span>
                                </li>
                            </ul>
                        </div>

                        {/* Key Features */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Key Features</h3>
                            <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                                <li className="flex items-start">
                                    <span className="text-teal-500 font-bold mr-3">✨</span>
                                    <span><strong>Full-Stack:</strong> Backend API + Frontend UI + Database</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-teal-500 font-bold mr-3">✨</span>
                                    <span><strong>Flexible Storage:</strong> Use JSON for dev or Supabase for production</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-teal-500 font-bold mr-3">✨</span>
                                    <span><strong>RESTful API:</strong> Easy-to-use endpoints for all operations</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-teal-500 font-bold mr-3">✨</span>
                                    <span><strong>Containerized:</strong> Docker support for easy deployment</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-teal-500 font-bold mr-3">✨</span>
                                    <span><strong>Scalable:</strong> Handle thousands of books efficiently</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Tech Stack */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 border-blue-500">
                            <h4 className="font-semibold text-gray-800 dark:text-white mb-3">🔧 Backend</h4>
                            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                                <li>• FastAPI (Python)</li>
                                <li>• BeautifulSoup4 (Scraping)</li>
                                <li>• SQLAlchemy (ORM)</li>
                                <li>• PostgreSQL/SQLite</li>
                                <li>• Docker</li>
                            </ul>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 border-pink-500">
                            <h4 className="font-semibold text-gray-800 dark:text-white mb-3">🎨 Frontend</h4>
                            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                                <li>• Next.js 16</li>
                                <li>• React 19</li>
                                <li>• TypeScript</li>
                                <li>• Tailwind CSS</li>
                                <li>• Responsive Design</li>
                            </ul>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 border-purple-500">
                            <h4 className="font-semibold text-gray-800 dark:text-white mb-3">💾 Data</h4>
                            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                                <li>• JSON Files (Dev)</li>
                                <li>• Supabase (Prod)</li>
                                <li>• 51 Categories</li>
                                <li>• Book Images</li>
                                <li>• Real-time Sync</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Architecture & Approach */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg shadow-lg p-8 mb-8 border border-blue-200 dark:border-blue-800">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">🏗️ Data Architecture & Approach</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* JSON Approach */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-l-4 border-green-500">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">📄 JSON Files (Development)</h3>
                            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-2">✓</span>
                                    <span>Fast local data access without database</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-2">✓</span>
                                    <span>Perfect for frontend development & testing</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-2">✓</span>
                                    <span>No server dependency required</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-2">✓</span>
                                    <span>Currently: 51 categories + sample data</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-gray-400 mr-2">→</span>
                                    <span className="text-gray-600 dark:text-gray-400">Location: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">data/</code></span>
                                </li>
                            </ul>
                        </div>

                        {/* Supabase Approach */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-l-4 border-purple-500">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">🗄️ Supabase (Production)</h3>
                            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                <li className="flex items-start">
                                    <span className="text-purple-500 mr-2">✓</span>
                                    <span>PostgreSQL database with real-time capabilities</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-purple-500 mr-2">✓</span>
                                    <span>Scalable for large datasets</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-purple-500 mr-2">✓</span>
                                    <span>Built-in authentication & authorization</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-purple-500 mr-2">✓</span>
                                    <span>Automatic backups & disaster recovery</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-gray-400 mr-2">→</span>
                                    <span className="text-gray-600 dark:text-gray-400">Configured via <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">.env</code></span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Switching Strategy */}
                    <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-6 border-l-4 border-orange-500">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">🔄 Switching Strategy</h3>
                        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                            <div className="flex items-start">
                                <span className="text-orange-500 font-bold mr-3">1.</span>
                                <span><strong>Development Phase:</strong> Frontend uses JSON files from <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">data/</code> folder for rapid iteration</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-orange-500 font-bold mr-3">2.</span>
                                <span><strong>API Layer:</strong> Backend provides unified API endpoints that work with both JSON and Supabase</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-orange-500 font-bold mr-3">3.</span>
                                <span><strong>Environment Config:</strong> Frontend detects environment and switches data source automatically</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-orange-500 font-bold mr-3">4.</span>
                                <span><strong>Production:</strong> Switch to Supabase via environment variables without code changes</span>
                            </div>
                        </div>
                    </div>

                    {/* Implementation Details */}
                    <div className="mt-6 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-6 border border-amber-200 dark:border-amber-800">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">⚙️ Implementation Details</h3>
                        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                            <p><strong>Data Source Priority:</strong></p>
                            <ol className="list-decimal list-inside space-y-1 ml-2">
                                <li>Check <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">NEXT_PUBLIC_DATA_SOURCE</code> env variable</li>
                                <li>If <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">supabase</code> → Connect to Supabase via backend API</li>
                                <li>If <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">json</code> → Load from local JSON files</li>
                                <li>Default: JSON (for development)</li>
                            </ol>
                        </div>
                    </div>
                </div>

                {/* How It Works */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8 border-t-4 border-blue-500">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">🔄 How It Works</h2>

                    <div className="space-y-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-500 text-white font-bold">1</div>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Backend Scrapes Data</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">FastAPI backend connects to books.toscrape.com and extracts book information using BeautifulSoup4</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-500 text-white font-bold">2</div>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Data Gets Stored</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Data is saved to both JSON files (for dev) and database (SQLite/Supabase for production)</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-500 text-white font-bold">3</div>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Images Downloaded</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Book cover images are automatically downloaded and stored in the media folder</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-500 text-white font-bold">4</div>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Frontend Displays Data</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Next.js frontend fetches data from backend API and displays books in a beautiful UI</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-500 text-white font-bold">5</div>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">User Interacts</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Users browse categories, search books, view details, and interact with the application</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Project Structure */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8 border-t-4 border-purple-500">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">📁 Project Structure</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">📦 Backend</h3>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 font-mono">
                                <li className="text-blue-600 dark:text-blue-400">backend/</li>
                                <li className="ml-4">├── app/</li>
                                <li className="ml-8">├── api/ (endpoints)</li>
                                <li className="ml-8">├── scrapers/ (logic)</li>
                                <li className="ml-8">├── db/ (models)</li>
                                <li className="ml-8">└── core/ (utilities)</li>
                                <li className="ml-4">├── media/ (images)</li>
                                <li className="ml-4">└── requirements.txt</li>
                            </ul>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">🎨 Frontend</h3>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 font-mono">
                                <li className="text-pink-600 dark:text-pink-400">frontend/</li>
                                <li className="ml-4">├── src/</li>
                                <li className="ml-8">├── app/ (pages)</li>
                                <li className="ml-8">├── components/ (UI)</li>
                                <li className="ml-8">└── lib/ (utilities)</li>
                                <li className="ml-4">├── public/ (assets)</li>
                                <li className="ml-4">└── package.json</li>
                            </ul>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">💾 Data</h3>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 font-mono">
                                <li className="text-yellow-600 dark:text-yellow-400">data/</li>
                                <li className="ml-4">├── categories.json</li>
                                <li className="ml-4">├── romance.json</li>
                                <li className="ml-4">└── religion.json</li>
                                <li className="mt-4 text-gray-500">Generated from scraper</li>
                                <li className="text-gray-500">51 categories total</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Getting Started */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8 border-t-4 border-green-500">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">🚀 Getting Started</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Backend Setup</h3>
                            <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 text-gray-100 text-sm font-mono space-y-1">
                                <p>$ cd backend</p>
                                <p>$ python -m venv .venv</p>
                                <p>$ source .venv/bin/activate</p>
                                <p>$ pip install -r requirements.txt</p>
                                <p>$ uvicorn app.main:app --reload</p>
                                <p className="text-green-400 mt-2">→ http://localhost:8000</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Frontend Setup</h3>
                            <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 text-gray-100 text-sm font-mono space-y-1">
                                <p>$ cd frontend</p>
                                <p>$ npm install</p>
                                <p>$ npm run dev</p>
                                <p className="text-green-400 mt-2">→ http://localhost:3000</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>💡 Tip:</strong> Start with JSON data source for development. No database setup needed! Switch to Supabase later for production.
                        </p>
                    </div>
                </div>

                {/* FAQ */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8 border-t-4 border-orange-500">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">❓ Frequently Asked Questions</h2>

                    <div className="space-y-4">
                        <details className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                            <summary className="font-semibold text-gray-800 dark:text-white">What's the difference between JSON and Supabase?</summary>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                                <strong>JSON:</strong> Local files, perfect for development, no setup needed. <strong>Supabase:</strong> Cloud database, production-ready, scalable, with real-time features.
                            </p>
                        </details>

                        <details className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                            <summary className="font-semibold text-gray-800 dark:text-white">Can I switch between JSON and Supabase?</summary>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                                Yes! Set the <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-xs">NEXT_PUBLIC_DATA_SOURCE</code> environment variable to <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-xs">json</code> or <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-xs">supabase</code>.
                            </p>
                        </details>

                        <details className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                            <summary className="font-semibold text-gray-800 dark:text-white">How many books are currently scraped?</summary>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                                We have 51 book categories scraped. Sample data is available for Romance and Religion categories. More categories can be scraped on demand.
                            </p>
                        </details>

                        <details className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                            <summary className="font-semibold text-gray-800 dark:text-white">Do I need Docker to run this?</summary>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                                No, Docker is optional. You can run the backend directly with Python and the frontend with Node.js. Docker is useful for production deployment.
                            </p>
                        </details>

                        <details className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                            <summary className="font-semibold text-gray-800 dark:text-white">What&apos;s the current completion status?</summary>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                                Backend scraping is 100% complete. Frontend UI is in progress. We&apos;re at 35% overall completion with focus on frontend development and API integration.
                            </p>
                        </details>

                        <details className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                            <summary className="font-semibold text-gray-800 dark:text-white">Can I deploy this to production?</summary>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                                Yes! The backend is production-ready. For frontend, complete the UI components first. Use Docker for containerization and deploy to any cloud platform (AWS, Vercel, Heroku, etc.).
                            </p>
                        </details>
                    </div>
                </div>

                {/* Progress Overview */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Overall Progress</h2>
                        <div className="text-right">
                            <div className="text-4xl font-bold text-green-600 dark:text-green-400">{progressPercentage}%</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{completedTasks} of {totalTasks} tasks</div>
                        </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                        <div
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                </div>

                {/* Category Filter */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Filter by Category</h3>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === 'all'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            All Categories
                        </button>
                        {categories.map((category) => {
                            const categoryTasks = getTasksByCategory(category);
                            const completedCount = getCompletedTasksByCategory(category);
                            return (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    {categoryNames[category]} ({completedCount}/{categoryTasks.length})
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tasks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {filteredTasks.map((task) => (
                        <div
                            key={task.id}
                            className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 transition-all duration-200 hover:shadow-xl ${task.completed
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                : 'border-gray-300 dark:border-gray-600'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center">
                                    <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${task.completed ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-600'
                                            }`}
                                    >
                                        {task.completed ? (
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        ) : (
                                            <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full"></div>
                                        )}
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[task.category]}`}>
                                        {categoryNames[task.category]}
                                    </span>
                                </div>
                            </div>
                            <h3 className={`text-lg font-semibold mb-2 ${task.completed ? 'text-green-800 dark:text-green-200' : 'text-gray-800 dark:text-white'}`}>
                                {task.title}
                            </h3>
                            <p className={`text-sm ${task.completed ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'}`}>
                                {task.description}
                            </p>
                            <div className={`mt-4 text-xs font-medium ${task.completed ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                                {task.completed ? '✅ Completed' : '⏳ Pending'}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Category Summary */}
                {selectedCategory === 'all' && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">Progress by Category</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {categories.map((category) => {
                                const categoryTasks = getTasksByCategory(category);
                                const completedCount = getCompletedTasksByCategory(category);
                                const categoryProgress = Math.round((completedCount / categoryTasks.length) * 100);
                                return (
                                    <div key={category} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[category]}`}>
                                                {categoryNames[category]}
                                            </span>
                                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                                {completedCount}/{categoryTasks.length}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 mb-2">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                                                style={{ width: `${categoryProgress}%` }}
                                            ></div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{categoryProgress}%</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
