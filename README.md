# VANI MILK CENTER, GOPIVANIPALEM - Ordering Website & Admin System

A complete, modern, responsive full-stack website and ordering platform built for Vani Milk Center, Gopivanipalem. Customers can browse 100% pure and natural dairy products (milk, curd, ghee, paneer, buttermilk, lassi, and bulk buckets for marriage functions), manage an interactive shopping cart with local persistence, and submit orders directly to the shop owner via WhatsApp. Contact: 7995597719.

---

## 🌟 Key Features

### 🛒 Customer Storefront
- **Fresh Dairy Visual Experience**: Milky white, cream, sky blue, and fresh emerald green palette with high-resolution photography.
- **Product Variants & Pack Sizes**:
  - **Milk**: 250 ml, 500 ml, 1 Litre
  - **Curd (Dahi)**: 250 ml, 500 ml, 1 Litre, 5 kg bucket, 10 kg bucket, 20 kg bucket
  - **Buttermilk (Chaas)**: 250 ml, 500 ml, 1 Litre
  - **Sweet Lassi**: 250 ml, 500 ml, 1 Litre
  - **Paneer & Desi Ghee**: 200g, 500g, 1kg / 250ml, 500ml, 1L
- **Live Variant Pricing**: Changing pack size immediately recalculates the product card price and stock status.
- **Marriage & Special Function Bulk Orders**: Dedicated section highlighting 5kg, 10kg, and 20kg curd buckets and large milk quantities for catering, marriages, birthdays, and community poojas.
- **Persistent Shopping Cart**: Maintained in `localStorage` across page navigation and reloads. Includes a slide-over drawer and a dedicated checkout page.
- **Instant WhatsApp Ordering**: Automatically formats a structured, clean order message and opens WhatsApp with the shop owner's configured number. No manual typing required.
- **Floating WhatsApp Quick Button**: Persistent at bottom-right corner for quick customer enquiries.
- **Touch-Friendly & Mobile-First**: 44px+ touch targets and intuitive 1-hand mobile flow.
- **Instant Search & Category Filtering**: Quick filtering by category (Milk, Curd, Buttermilk, Lassi, Other) and real-time search matching product names, descriptions, or pack sizes (e.g. "10 kg", "Curd").

### 🔐 Secure Admin Dashboard (`/admin`)
- **Protected Authentication**:
  - Salted bcrypt password hashing.
  - HTTP-only signed JWT session cookies.
  - Route middleware guarding `/admin/*` and API routes from unauthorized access.
- **KPI Dashboard**:
  - Total Products, Available Products, Out-of-Stock Variants, Total Orders, Pending Orders, Function Orders, and Total Revenue.
  - Recent orders feed with quick WhatsApp customer action.
- **Product & Variant Management (Full CRUD)**:
  - Add, edit, and delete products.
  - Add and modify multiple variants per product with independent pack sizes, prices, stock quantities, and availability toggles.
  - Upload product photos (`/api/upload`) with instant preview.
  - Deletion confirmation modal to prevent accidental data loss.
- **Order Tracking & Status Management**:
  - Real-time customer orders table displaying snapshot prices, pack sizes, quantities, totals, and special function notes.
  - Status transitions: `Pending` → `Confirmed` → `Preparing` → `Ready` → `Delivered` → `Cancelled`.
  - "Open WhatsApp" button with pre-filled status context to message the customer directly.
- **Dynamic Shop Settings**:
  - Update Shop Name, Public Phone, WhatsApp Number, Address, Opening Hours, Google Maps URL, Logo, and About text without code changes.

### 🛡️ Security & Anti-Tampering
- **Server-Side Price Validation**: Final order prices and totals are strictly calculated from the database on the server. Client-side browser tampering is completely prevented.
- **Stock Depletion & Validation**: Prevents checkout if requested quantity exceeds available inventory and automatically decrements stock upon order placement.
- **Historical Price Snapshotting**: `OrderItem` stores the product name, pack size, and unit price at the time of order creation so future catalog price changes never alter past order records.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router, Server Components & Route Handlers)
- **Frontend**: React 19, Tailwind CSS, Lucide React Icons
- **Database & ORM**: Prisma ORM with SQLite (zero-config, portable) / PostgreSQL ready
- **Authentication**: Salted bcrypt password hashing & secure HTTP-only JWT cookies
- **WhatsApp Integration**: Dynamic WhatsApp URL generator with international formatting
- **SEO**: Metadata, OpenGraph tags, dynamic `robots.txt` and `sitemap.xml`

---

## 📁 Project Structure

```
milk-center/
├── prisma/
│   ├── schema.prisma            # Database models (User, Category, Product, ProductVariant, Order, OrderItem, ShopSettings)
│   ├── seed.js                  # Database seed script with initial dairy products, admin user & settings
│   └── dev.db                   # SQLite database
├── public/
│   ├── images/
│   │   ├── hero-dairy.jpg       # High-resolution dairy storefront hero banner
│   │   ├── shop-logo.svg        # Shop branding SVG mark
│   │   └── products/            # Visual catalog (milk, curd, curd buckets, buttermilk, lassi, paneer, ghee)
│   └── uploads/                 # Local storage for admin-uploaded images
├── scripts/
│   └── test-scenario.js         # Comprehensive 40-assertion automated test suite
├── src/
│   ├── app/
│   │   ├── (customer)/
│   │   │   ├── page.tsx         # Customer home page (Hero, Categories, Popular Products, Function banner, Why Us, Contact)
│   │   │   ├── products/        # Product catalogue with Search, Filters, and Variant selector
│   │   │   ├── cart/            # Review order, customer details form & WhatsApp checkout
│   │   │   ├── about/           # Shop story & quality commitment
│   │   │   └── contact/         # Shop location, timings & Google Maps link
│   │   ├── admin/
│   │   │   ├── login/           # Admin login page
│   │   │   ├── layout.tsx       # Admin navigation shell (Sidebar, Header, Auth Guard)
│   │   │   ├── page.tsx         # Dashboard overview & KPI metrics
│   │   │   ├── products/        # Product & Variant CRUD with image upload
│   │   │   ├── orders/          # Orders manager with status changer & customer WhatsApp
│   │   │   └── settings/        # Shop metadata & WhatsApp number configuration
│   │   ├── api/
│   │   │   ├── auth/            # Login, logout, session verification
│   │   │   ├── products/        # Products CRUD endpoints
│   │   │   ├── orders/          # Checkout with server validation & admin order updates
│   │   │   ├── settings/        # Public shop settings & admin updates
│   │   │   └── upload/          # Admin image file upload handler
│   │   ├── layout.tsx           # Global HTML layout with providers
│   │   ├── globals.css          # Tailwind CSS styles & dairy gradients
│   │   ├── robots.ts            # SEO robots.txt
│   │   └── sitemap.ts           # SEO sitemap.xml
│   ├── components/
│   │   └── customer/            # Navbar, Footer, Hero, ProductCard, CartDrawer, BulkOrderBanner, ContactSection
│   ├── context/
│   │   ├── CartContext.tsx      # Cart state with localStorage persistence
│   │   └── ShopSettingsContext.tsx # Shop metadata context
│   ├── lib/
│   │   ├── auth.ts              # Authentication & password hashing helpers
│   │   ├── db.ts                # Prisma singleton instance
│   │   ├── utils.ts             # Currency formatter (₹), date helpers
│   │   └── whatsapp.ts          # Order message & WhatsApp URL formatter
│   └── middleware.ts            # Route protection middleware for /admin/*
├── .env.example                 # Environment variables template
├── .env                         # Local environment configuration
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.17+ or v20+ / v22+
- **npm**: v9+ / v10+

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configuration details:
```env
# Database URL (SQLite for local zero-config; switchable to PostgreSQL)
DATABASE_URL="file:./dev.db"

# Admin JWT Authentication Secret
JWT_SECRET="dairy_secret_super_secure_key_2026_jwt_token"

# Default Admin Credentials
ADMIN_EMAIL="admin@dairy.local"
ADMIN_PASSWORD="AdminPassword@2026"

# Shop Owner WhatsApp Number (International format without + or spaces)
SHOP_WHATSAPP_NUMBER="919876543210"
```

### 4. Database Setup & Seeding
Initialize the database and populate sample products, variants, and the admin account:
```bash
npx prisma db push
node prisma/seed.js
```

### 5. Running the Application Locally
Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Automated Testing

Run the test suite verifying all 40 assertions (authentication, CRUD, server-side pricing, inventory reduction, Curd 10kg bucket x 5 = ₹2,500 scenario, and WhatsApp formatting):
```bash
node scripts/test-scenario.js
```

---

## 👨‍💼 Admin Panel Access

- **URL**: [http://localhost:3000/admin](http://localhost:3000/admin) (redirects to `/admin/login` if unauthenticated)
- **Email**: `siddreddylakshmankumar@gmail.com`
- **Password**: `VANI@MILK`
- **Phone / WhatsApp**: `7995597719` / `917995597719`

---

## 📱 WhatsApp Order Message Example

When a customer checks out, the following formatted message is automatically created and sent to the configured shop WhatsApp number:

```text
*New Dairy Product Order*
Order Ref: #0VMBE6
*Customer Name:* Rahul
*Mobile:* 9876543210
*Address:* Tuni, Andhra Pradesh

*Products:*
1. *Traditional Thick Curd (Dahi)*
   Pack Size: 10 kg bucket
   Quantity: 5
   Price: ₹500
   Total: ₹2,500

*Order Total:* ₹2,500

*Special Instructions:*
Required for marriage function.

Thank you for choosing our fresh dairy shop!
```

---

## 📦 Production Deployment

1. **Build the Application**:
   ```bash
   npm run build
   ```
2. **Start the Production Server**:
   ```bash
   npm run start
   ```
3. **Switching to PostgreSQL (Optional)**:
   In `prisma/schema.prisma`, update the datasource provider:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
   Set your PostgreSQL connection string in `.env` and run `npx prisma db push`.
#   V A N I - M I L K - C E N T E R 
 
 