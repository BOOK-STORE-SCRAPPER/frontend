# Book Store Scraper - Frontend

Next.js frontend application for the Book Store Web Scraper.

## 🚀 Quick Start

### Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create `.env.local`**:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open**: [http://localhost:3000](http://localhost:3000)

---

## 📦 Build & Deploy

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

1. **Push to GitHub** (see `DEPLOYMENT_SETUP.md`)

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

3. **Add Environment Variable**:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```

4. **Deploy**: Vercel will auto-detect Next.js and deploy

See `DEPLOYMENT.md` for detailed instructions.

---

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` |

### Image Configuration

Images are configured in `next.config.ts` to allow:
- Local development (`localhost:8000`)
- Backend deployments (Railway, Render, Fly.io)
- External book images from `books.toscrape.com`

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── page.tsx      # Home page
│   │   └── admin/        # Admin dashboard
│   ├── components/       # React components
│   │   ├── CategorySidebar.tsx
│   │   ├── BookList.tsx
│   │   ├── BookDetails.tsx
│   │   ├── StatsBox.tsx
│   │   └── AdminPanel.tsx
│   ├── lib/
│   │   └── api.ts        # API utility (uses env vars)
│   └── types/
│       └── api.ts        # TypeScript types
├── public/               # Static assets
├── package.json
├── next.config.ts
└── vercel.json          # Vercel deployment config
```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **HTTP Client**: Fetch API (via `lib/api.ts`)

---

## 📝 API Integration

All API calls use the centralized `lib/api.ts` utility which:
- Uses `NEXT_PUBLIC_API_URL` environment variable
- Handles errors consistently
- Provides type-safe methods (`get`, `post`, `delete`)

Example:
```typescript
import { api } from '@/lib/api';

const categories = await api.get<Category[]>('/categories');
```

---

## ✅ Deployment Checklist

Before deploying:

- [ ] Set `NEXT_PUBLIC_API_URL` in Vercel environment variables
- [ ] Verify backend CORS allows your Vercel domain
- [ ] Test API connection after deployment
- [ ] Check image loading (backend media URLs)

---

## 🐛 Troubleshooting

### API Connection Issues

**Problem**: Frontend can't connect to backend

**Solutions**:
1. Verify `NEXT_PUBLIC_API_URL` is set in Vercel
2. Check backend CORS settings
3. Verify backend is running and accessible
4. Check browser console for errors

### Image Loading Issues

**Problem**: Images don't load

**Solutions**:
1. Verify backend media URLs are accessible
2. Check `next.config.ts` image patterns include your backend domain
3. Ensure backend CORS allows image requests

---

## 📚 Documentation

- **Deployment**: See `DEPLOYMENT.md`
- **Complete Setup**: See `../DEPLOYMENT_SETUP.md`
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

---

## 📄 License

MIT License
