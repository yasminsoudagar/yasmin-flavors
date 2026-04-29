# Yasmin Flavors — Backend Setup Guide

## Stack
- **Database + Auth**: Supabase (PostgreSQL + built-in Auth)
- **API Server**: Node.js + Express (hosted on Railway)
- **Payments**: Stripe
- **Emails**: Resend
- **Frontend**: Lovable (React)

---

## Step 1 — Create Your Supabase Project

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Name it `yasmin-flavors`, choose a region close to you
3. Once created, go to **SQL Editor** and run the entire contents of:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
4. Go to **Settings → API** and copy:
   - `Project URL` → `SUPABASE_URL`
   - `anon public` key → `SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### Enable Google OAuth (for Sign in with Google)
1. Supabase Dashboard → **Authentication → Providers → Google**
2. Enable it, then go to [Google Cloud Console](https://console.cloud.google.com)
3. Create OAuth credentials → add your Supabase callback URL
4. Paste Client ID + Secret back into Supabase

---

## Step 2 — Deploy the API to Railway

1. Go to [railway.app](https://railway.app) → **New Project → Deploy from GitHub**
2. Push this folder to a GitHub repo and connect it
3. Railway auto-detects Node.js and runs `npm start`
4. In Railway → **Variables**, add all the keys from `.env.example`
5. Copy the Railway public URL (e.g. `https://yasmin-api.up.railway.app`)

> **Free alternative**: Use [Render.com](https://render.com) — same steps, also free tier available.

---

## Step 3 — Set Up Stripe

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Get your **Secret Key** (test mode while building)
3. For webhooks: **Developers → Webhooks → Add endpoint**
   - URL: `https://your-railway-url.up.railway.app/api/payments/webhook`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy the **Webhook Signing Secret** → `STRIPE_WEBHOOK_SECRET`

---

## Step 4 — Set Up Email (Resend)

1. Go to [resend.com](https://resend.com) → create account
2. Add and verify your domain (or use their sandbox for testing)
3. Copy your **API key** → `RESEND_API_KEY`

---

## Step 5 — Connect Your Lovable Frontend

1. Copy `docs/api.js` into your Lovable project at `src/lib/api.js`
2. In Lovable, add these environment variables:
   ```
   VITE_API_URL=https://your-railway-url.up.railway.app
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Import and use in your components:
   ```js
   import { menuApi, ordersApi, wishlistApi } from '@/lib/api'

   // Fetch menu items
   const { items } = await menuApi.getItems({ category: 'Burgers', veg: false })

   // Place an order
   const order = await ordersApi.placeOrder({
     items: [{ item_id: '...', quantity: 2 }],
     address_id: '...'
   })

   // Toggle wishlist
   await wishlistApi.addItem(itemId)
   ```

---

## API Reference

### Menu
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/menu/categories` | All categories |
| GET | `/api/menu/items` | Items (filter: `category`, `veg`, `search`, `sort`) |
| GET | `/api/menu/items/:id` | Single item with reviews |
| POST | `/api/menu/items` | *(Admin)* Create item |
| PATCH | `/api/menu/items/:id` | *(Admin)* Update item |
| DELETE | `/api/menu/items/:id` | *(Admin)* Remove item |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | My orders |
| GET | `/api/orders/:id` | Single order detail |
| POST | `/api/orders` | Place new order |
| PATCH | `/api/orders/:id/status` | *(Admin)* Update status |
| GET | `/api/orders/admin/all` | *(Admin)* All orders |

### Wishlist
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/wishlist` | My wishlist |
| POST | `/api/wishlist` | Add item `{ item_id }` |
| DELETE | `/api/wishlist/:item_id` | Remove item |
| DELETE | `/api/wishlist` | Clear wishlist |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/me` | My profile |
| PATCH | `/api/users/me` | Update profile |
| GET | `/api/users/me/addresses` | My addresses |
| POST | `/api/users/me/addresses` | Add address |
| DELETE | `/api/users/me/addresses/:id` | Delete address |
| GET | `/api/users/me/notifications` | My notifications |
| PATCH | `/api/users/me/notifications/read` | Mark all read |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reviews?item_id=` | Reviews for an item |
| POST | `/api/reviews` | Submit review |
| PATCH | `/api/reviews/:id` | Edit review |
| DELETE | `/api/reviews/:id` | Delete review |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/create-intent` | Create Stripe PaymentIntent |
| POST | `/api/payments/webhook` | Stripe webhook (internal) |

---

## Making a User Admin

Run this in the Supabase SQL Editor to make yourself admin:
```sql
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

UPDATE public.profiles
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'your@email.com');
```

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Copy and fill in your keys
cp .env.example .env

# 3. Run with hot reload
npm run dev
# → API running at http://localhost:3001
```
