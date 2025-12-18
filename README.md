# 📚 Book Store Scraper - Frontend

Next.js frontend application for the Book Store Web Scraper. A modern, responsive UI for scraping and viewing book data from [books.toscrape.com](http://books.toscrape.com).

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- **Node.js 18+** (check with `node --version`)
- **npm** or **yarn** (comes with Node.js)

### Step 1: Clone the Repository

```bash
git clone https://github.com/BOOK-STORE-SCRAPER/frontend.git
cd book-store-scraper-frontend
```

> **Note**: Replace `YOUR_ORG` with your GitHub organization name.

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Setup Environment Variables

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local if your backend is running on a different URL
# Default: http://localhost:8000 (works if backend is running locally)
```

**Default `.env.local` configuration:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Step 4: Start Development Server

```bash
npm run dev
```

The frontend will start at: **http://localhost:3000**

### Step 5: Verify Installation

1. Open http://localhost:3000 in your browser
2. Make sure the backend is running at http://localhost:8000
3. You should see the Book Store Scraper interface

---

## 🔗 Backend Connection

This frontend requires the [book-store-scraper-backend](https://github.com/BOOK-STORE-SCRAPER/frontend) to be running.

### Quick Backend Setup

1. Clone the backend repository
2. Follow backend README to start it
3. Backend should run on `http://localhost:8000`
4. Frontend will automatically connect to it

### Backend Not Running?

If the backend is not running, you'll see connection errors in the browser console. Make sure:

1. Backend is running on `http://localhost:8000`
2. `NEXT_PUBLIC_API_URL` in `.env.local` matches your backend URL
3. Backend CORS allows `http://localhost:3000`

---

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the root directory (copy from `.env.example`):

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000` |

**Important**: 
- `.env.local` is git-ignored (your local config)
- `.env.example` is committed (template for others)
- Always use `.env.local` for local development

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── page.tsx           # Home page
│   │   ├── admin/             # Admin dashboard
│   │   │   └── page.tsx
│   │   ├── dev-status/        # Development status page
│   │   │   └── page.tsx
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── CategorySidebar.tsx
│   │   ├── BookList.tsx
│   │   ├── BookDetails.tsx
│   │   ├── StatsBox.tsx
│   │   └── AdminPanel.tsx
│   ├── lib/
│   │   └── api.ts             # API utility (uses env vars)
│   └── types/
│       └── api.ts             # TypeScript types
├── public/                    # Static assets
├── .env.example              # Environment variables template
├── package.json              # Dependencies
├── next.config.ts            # Next.js configuration
└── README.md                 # This file
```

---

## 🛠️ Available Scripts

```bash
# Development server (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

---

## 🎨 Features

- ✅ **Category Scraping**: Scrape all book categories from the website
- ✅ **Book Listing**: View books by category in organized tables
- ✅ **Real-time Stats**: Live statistics dashboard
- ✅ **Book Details**: View detailed information about each book
- ✅ **Image Display**: View book cover images
- ✅ **Responsive Design**: Works on desktop and mobile
- ✅ **Admin Panel**: Admin dashboard for managing data

---

## 🔌 API Integration

All API calls are handled through `src/lib/api.ts` which:

- Uses `NEXT_PUBLIC_API_URL` from environment variables
- Provides type-safe methods (`get`, `post`, `delete`)
- Handles errors consistently
- Automatically constructs full URLs

**Example Usage:**
```typescript
import { api } from '@/lib/api';

// Get categories
const categories = await api.get<Category[]>('/categories');

// Scrape categories
await api.post('/categories', { base_url: 'https://books.toscrape.com/' });
```

---

## 🖼️ Image Configuration

Images are configured in `next.config.ts` to allow:

- Local development (`localhost:8000`)
- Backend media files (`/media/**`)
- External book images from `books.toscrape.com`

No additional configuration needed for local development!

---

## 🐛 Troubleshooting

### Backend Connection Issues

**Problem**: Frontend can't connect to backend

**Solutions**:
1. Verify backend is running: http://localhost:8000/health
2. Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
3. Verify backend CORS allows `http://localhost:3000`
4. Check browser console for specific errors

### Build Errors

**Problem**: `npm run build` fails

**Solutions**:
1. Ensure all dependencies are installed: `npm install`
2. Check for TypeScript errors: `npm run lint`
3. Verify environment variables are set correctly

### Port Already in Use

**Error**: `Port 3000 is already in use`

**Solution**:
```bash
# Use a different port
npm run dev -- -p 3001
```

### Module Not Found

**Error**: `Cannot find module`

**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🚀 Production Build

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables for Production

When deploying, set `NEXT_PUBLIC_API_URL` to your production backend URL:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **HTTP Client**: Fetch API (via `lib/api.ts`)

---

## 📚 Additional Resources

- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev
- **TypeScript Docs**: https://www.typescriptlang.org/docs
- **Tailwind CSS Docs**: https://tailwindcss.com/docs

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License

---

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check the [backend repository](https://github.com/YOUR_ORG/book-store-scraper-backend) for API documentation

---

**Happy Scraping! 🚀**
