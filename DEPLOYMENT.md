# Frontend Deployment Guide

Deploy your Next.js frontend to Vercel (free tier).

## 🚀 Deploy to Vercel

### Steps:

1. **Sign up** at [vercel.com](https://vercel.com) (use GitHub)

2. **Import Project**:
   - Click "Add New" → "Project"
   - Import your frontend GitHub repository

3. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

4. **Add Environment Variable**:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```
   Replace with your actual backend URL (Railway/Render/Fly.io)

5. **Deploy**: Click "Deploy"

6. **Get your frontend URL**: Vercel provides `https://your-app.vercel.app`

---

## 🔄 Updating Backend URL

After deploying backend, update frontend:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `NEXT_PUBLIC_API_URL` with your backend URL
3. Redeploy (or it will auto-redeploy on next push)

---

## 📝 Environment Variables

### Local Development

Create `.env.local` in `frontend/` directory:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Production (Vercel)

Set in Vercel Dashboard → Environment Variables:
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

---

## ✅ Post-Deployment Checklist

- [ ] Frontend is accessible
- [ ] `NEXT_PUBLIC_API_URL` is set correctly
- [ ] Backend CORS allows your frontend domain
- [ ] API calls work (check browser console)
- [ ] Images load correctly (if using backend media)

---

## 🔧 Troubleshooting

### API Connection Errors

**Problem**: Frontend can't connect to backend

**Solutions**:
1. Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel
2. Check backend CORS settings (must include your Vercel domain)
3. Verify backend is running and accessible
4. Check browser console for specific error messages

### CORS Errors

**Problem**: CORS policy blocking requests

**Solution**: Update backend `main.py`:
```python
allow_origins=[
    "http://localhost:3000",  # Local dev
    "https://your-app.vercel.app"  # Production
]
```

### Build Errors

**Problem**: Vercel build fails

**Solutions**:
1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version (Vercel auto-detects, but check if issues)

---

## 📞 Support

- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Next.js Docs: [nextjs.org/docs](https://nextjs.org/docs)

