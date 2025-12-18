# 3-Level Scraping Implementation

## Architecture

### Level 1: Categories
- **Scraper:** `scrape_categories()` in `backend/app/scrapers/categories.py`
- **Table:** `categories` table
- **Fields:** id, name, url
- **Endpoint:** `GET /categories/`

### Level 2: Products (Product List)
- **Scraper:** `scrape_list_pages()` in `backend/app/scrapers/generic.py`
- **Table:** `books` table (basic fields)
- **Fields:** title, product_url, price, availability, category_id
- **Endpoint:** `GET /scrape/books`

### Level 3: Product Details
- **Scraper:** `scrape_book_details()` in `backend/app/scrapers/generic.py`
- **Table:** `books` table (detail fields)
- **Fields:** description, upc, product_type, rating, number_of_reviews, price_excl_tax, price_incl_tax, tax, image_url, image_path, details_scraped
- **Endpoint:** `GET /scrape/books/{book_id}`

## Database Schema

### Categories Table
```
id (PK)
name (unique)
url
```

### Books Table (Single table with all levels)
```
id (PK)
title
product_url
price
availability
category_id (FK)
description (Level 3)
upc (Level 3)
product_type (Level 3)
rating (Level 3)
number_of_reviews (Level 3)
price_excl_tax (Level 3)
price_incl_tax (Level 3)
tax (Level 3)
image_url (Level 3)
image_path (Level 3)
details_scraped (0/1 flag)
```

### Scraping Jobs Table (Tracking)
```
id (PK)
status (pending/running/completed/failed)
category_name
items_scraped
started_at
completed_at
error_message
```

## Scraping Flow

### Admin Endpoint: `POST /admin/scrape/start`

```
1. Create ScrapingJob record (status=RUNNING)
   ↓
2. Level 1: Scrape all categories
   - Call scrape_categories(base_url)
   - Save to categories table
   ↓
3. For each category:
   a. Level 2: Scrape product list
      - Call scrape_list_pages(category_url)
      - Save basic product info to books table
      - Mark details_scraped = 0
   
   b. Level 3: Scrape product details
      - For each product:
        - Call scrape_book_details(product_url)
        - Save details to books table
        - Download image
        - Mark details_scraped = 1
   ↓
4. Update ScrapingJob (status=COMPLETED, items_scraped=total)
```

## Frontend Display

### Admin Dashboard (`/admin`)
- Shows scraping status with 3 levels:
  - ✓ Level 1: Categories
  - ✓ Level 2: Product Lists
  - ⟳ Level 3: Product Details (in progress) → ✓ (completed)
- Shows job history
- Allows start/stop/clear operations

### User App (`/`)
- Displays categories (Level 1)
- Displays products (Level 2)
- Displays product details (Level 3) when clicked

## API Endpoints

### Admin
```
POST   /admin/scrape/start          → Trigger 3-level scraping
GET    /admin/scrape/status         → Get current job status
GET    /admin/scrape/history        → Get past jobs
DELETE /admin/data/clear            → Clear all data
```

### User (Read-only)
```
GET    /categories/                 → List all categories (Level 1)
GET    /categories/stats            → Stats
GET    /scrape/books                → List all products (Level 2)
GET    /scrape/books/{book_id}      → Get product details (Level 3)
```

## Key Features

✅ **Complete 3-level scraping** - Categories → Products → Details
✅ **Automatic detail scraping** - No manual triggering needed
✅ **Image downloading** - Saves product images locally
✅ **Progress tracking** - Job history and status
✅ **Error handling** - Continues on individual product failures
✅ **Database persistence** - All data stored in single Book table
✅ **Separation of concerns** - Admin scraping, User browsing

## Performance Notes

- Level 1 (Categories): ~1-2 seconds
- Level 2 (Products): ~1 second per category (with pagination)
- Level 3 (Details): ~2-3 seconds per product (includes image download)
- **Total time:** Depends on number of categories and products
  - Example: 10 categories × 20 products = ~600-900 seconds (~10-15 minutes)

## Future Improvements

- Add async scraping (background tasks)
- Add progress bar with real-time updates
- Add scheduled scraping (daily/weekly)
- Add retry logic for failed products
- Add rate limiting to avoid blocking
