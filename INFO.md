# ️ CRM Frontend - Project Information

Complete project information, setup guide, and connection documentation.

---

##  What is This?

The **CRM Frontend** is the admin dashboard for the SalonPro Salon Management System. It's a web application built with Next.js 14 that allows salon staff to manage all aspects of the business including:

-  Booking appointments
-  Managing customers
-  Processing payments (POS)
-  Viewing analytics and reports
-  Managing inventory
-  Tracking memberships and loyalty points
-  Sending WhatsApp notifications

---

##  Purpose

This application serves as the **central hub** for salon operations, providing:

1. **For Receptionists**: Quick booking, customer lookup, POS billing
2. **For Managers**: Reports, analytics, staff management
3. **For Owners**: Business insights, financial tracking, performance metrics

---

## ️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     CRM Frontend (Next.js)                  │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Dashboard  │  │   Booking    │  │   Customers  │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Reports    │  │   Inventory  │  │   Settings   │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│                  Backend API (Node.js/Express)              │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ Auth Module  │  │Booking Module│  │Customer Module│   │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      MongoDB Database                       │
└─────────────────────────────────────────────────────────────┘
```

---

##  How to Connect to Backend

### Step 1: Backend Setup

First, ensure the backend is running:

```bash
# Navigate to backend directory
cd ../../backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with MongoDB connection
MONGODB_URI=mongodb://localhost:27017/salon-management
PORT=5000

# Start backend
npm run dev
```

Backend will run at: `http://localhost:5000`

### Step 2: Frontend Configuration

Configure the frontend to connect to backend:

```bash
# Navigate to frontend directory
cd CRM/crm-frontend

# Create .env file
cp .env.example .env

# Update .env with backend URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Step 3: API Client

The frontend uses Axios to communicate with the backend:

```typescript
// src/lib/api.ts
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // http://localhost:5000/api
  timeout: 10000,
})

// Automatically add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
```

### Step 4: Making API Calls

Example of fetching data from backend:

```typescript
import api from '@/lib/api'

// Fetch bookings
const fetchBookings = async () => {
  const response = await api.get('/bookings')
  return response.data
}

// Create booking
const createBooking = async (data) => {
  const response = await api.post('/bookings', data)
  return response.data
}

// Update booking
const updateBooking = async (id, data) => {
  const response = await api.put(`/bookings/${id}`, data)
  return response.data
}

// Delete booking
const deleteBooking = async (id) => {
  const response = await api.delete(`/bookings/${id}`)
  return response.data
}
```

---

##  Quick Start Guide

### 1. Prerequisites

```bash
✓ Node.js 18 or higher
✓ npm or yarn
✓ Backend API running
✓ MongoDB running
```

### 2. Installation

```bash
# Clone repository (if not already)
git clone <repository-url>

# Navigate to frontend
cd "Salon Managemnt systrem/CRM/crm-frontend"

# Install dependencies
npm install
```

### 3. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env file
nano .env
```

Add this configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Run Development Server

```bash
npm run dev
```

Open browser: `http://localhost:3000`

### 5. Login

Default credentials:
- **Email**: admin@hairahmedabad.com
- **Password**: Admin@123

---

##  Required Files

### Essential Configuration Files

#### 1. `.env` (Environment Variables)
```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# NextAuth Configuration (if using)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

#### 2. `package.json` (Dependencies)
```json
{
  "name": "salon-management-frontend",
  "version": "0.1.0",
  "dependencies": {
    "next": "14.2.3",
    "react": "^18",
    "react-dom": "^18",
    "axios": "^1.6.8",
    "zustand": "^4.5.2",
    "lucide-react": "^0.378.0",
    "recharts": "^2.12.4"
  }
}
```

#### 3. `next.config.js` (Next.js Config)
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig
```

#### 4. `tailwind.config.ts` (Tailwind Config)
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config
```

#### 5. `tsconfig.json` (TypeScript Config)
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

##  API Endpoints Used

### Authentication
```
POST   /api/auth/login           → Login user
POST   /api/auth/logout          → Logout user
GET    /api/auth/me              → Get current user
```

### Bookings
```
GET    /api/bookings             → Get all bookings
POST   /api/bookings             → Create booking
GET    /api/bookings/:id         → Get booking by ID
PUT    /api/bookings/:id         → Update booking
DELETE /api/bookings/:id         → Delete booking
GET    /api/bookings/calendar    → Get calendar view
```

### Customers
```
GET    /api/customers            → Get all customers
POST   /api/customers            → Create customer
GET    /api/customers/:id        → Get customer by ID
PUT    /api/customers/:id        → Update customer
DELETE /api/customers/:id        → Delete customer
```

### Services
```
GET    /api/services             → Get all services
POST   /api/services             → Create service
GET    /api/services/:id         → Get service by ID
PUT    /api/services/:id         → Update service
DELETE /api/services/:id         → Delete service
```

### Staff
```
GET    /api/staff                → Get all staff
POST   /api/staff                → Create staff
GET    /api/staff/:id            → Get staff by ID
PUT    /api/staff/:id            → Update staff
DELETE /api/staff/:id            → Delete staff
```

### Inventory
```
GET    /api/inventory            → Get all products
POST   /api/inventory            → Create product
PUT    /api/inventory/:id        → Update product
GET    /api/inventory/low-stock  → Get low stock items
```

### Reports
```
GET    /api/reports/daily-reconciliation
GET    /api/reports/transactions
GET    /api/reports/business-trends
GET    /api/reports/stylist-progress
```

---

##  Key Features Explained

### 1. Dashboard
**What it does**: Shows business overview with KPIs
**Files**:
- `src/app/dashboard/page.tsx`
- Displays: Revenue, bookings, customers, charts

### 2. POS Billing
**What it does**: Quick billing for walk-in customers
**Files**:
- `src/app/booking/pos/page.tsx`
- Features: Service selection, payment processing, invoice generation

### 3. Booking Calendar
**What it does**: Visual calendar of appointments
**Files**:
- `src/app/booking/calendar/page.tsx`
- Features: Drag-drop, multi-staff view, time slots

### 4. Customer Management
**What it does**: Manage customer profiles and history
**Files**:
- `src/app/customers/page.tsx`
- Features: Search, filter, loyalty points, packages

### 5. Reports
**What it does**: Business analytics and insights
**Files**:
- `src/app/reports/page.tsx`
- Features: Charts, export, date filters

---

##  Troubleshooting

### Issue: Cannot connect to backend

**Solution**:
```bash
# Check backend is running
curl http://localhost:5000/api/health

# Check .env file
cat .env
# Should show: NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Restart frontend
npm run dev
```

### Issue: Authentication not working

**Solution**:
```bash
# Clear browser storage
localStorage.clear()

# Check backend auth endpoint
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hairahmedabad.com","password":"Admin@123"}'
```

### Issue: Pages not loading

**Solution**:
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Restart dev server
npm run dev
```

---

##  Dependencies Explained

### Core Dependencies

**next** (14.2.3)
- React framework for production
- Provides routing, SSR, API routes

**react** & **react-dom** (^18)
- UI library for building components

**typescript** (^5)
- Type safety and better developer experience

### State Management

**zustand** (^4.5.2)
- Lightweight state management
- Used for: auth, theme, global state

### HTTP Client

**axios** (^1.6.8)
- HTTP client for API calls
- Handles requests to backend

### Forms

**react-hook-form** (^7.51.3)
- Form handling and validation

**zod** (^3.23.4)
- Schema validation

**@hookform/resolvers** (^3.3.4)
- Connects Zod with React Hook Form

### UI & Styling

**tailwindcss** (^3.4.3)
- Utility-first CSS framework

**lucide-react** (^0.378.0)
- Icon library

**clsx** & **tailwind-merge**
- Utility for conditional classes

### Charts

**recharts** (^2.12.4)
- Data visualization library
- Used in dashboard and reports

---

##  Deployment

### Build for Production

```bash
# Build the application
npm run build

# Test production build locally
npm run start
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Environment Variables for Production

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-production-secret
```

---

##  Learning Resources

### Next.js
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Learn Course](https://nextjs.org/learn)

### React
- [React Documentation](https://react.dev/)
- [React Hooks](https://react.dev/reference/react)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Tailwind CSS
- [Tailwind Documentation](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com/)

---

##  Contributing

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes
3. Test thoroughly
4. Commit: `git commit -m "feat: add new feature"`
5. Push: `git push origin feature/new-feature`
6. Create Pull Request

---

##  Support

For issues or questions:
- Check documentation files (DESIGN.md, FRONTEND.md)
- Review backend API documentation
- Contact development team

---

**Built for Hair Ahmedabad** · Ahmedabad, Gujarat, India
