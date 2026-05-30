# 💻 CRM Frontend - Technical Documentation

Complete technical documentation for the SalonPro CRM Frontend application.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Features](#features)
5. [Pages & Routes](#pages--routes)
6. [Components](#components)
7. [State Management](#state-management)
8. [API Integration](#api-integration)
9. [Authentication](#authentication)
10. [Styling](#styling)
11. [Development](#development)
12. [Build & Deploy](#build--deploy)

---

## 🎯 Overview

The CRM Frontend is a Next.js 14 application built with TypeScript and Tailwind CSS. It provides a comprehensive admin dashboard for managing salon operations including bookings, customers, staff, inventory, and financial reports.

### Key Features
- 📅 Appointment booking and management
- 👥 Customer relationship management
- 💰 POS billing system
- 📊 Analytics and reports
- 💳 Payment tracking
- 📦 Inventory management
- 🎁 Loyalty and membership programs
- 📱 WhatsApp notifications
- 🌓 Dark mode support

---

## 🛠️ Tech Stack

### Core
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Lucide React icons

### State Management
- **Zustand**: Lightweight state management
- **React Hook Form**: Form handling and validation
- **Zod**: Schema validation

### Data Fetching
- **Axios**: HTTP client for API calls
- **Next.js Server Components**: Server-side data fetching

### Charts & Visualization
- **Recharts**: Data visualization library

### Authentication
- **NextAuth.js**: Authentication solution

### Development Tools
- **ESLint**: Code linting
- **TypeScript**: Type checking
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

---

## 📁 Project Structure

```
CRM/crm-frontend/
├── public/                    # Static assets
│   ├── favicon.ico
│   └── images/
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   ├── auth/             # Authentication pages
│   │   │   └── login/
│   │   ├── dashboard/        # Dashboard
│   │   ├── booking/          # Booking management
│   │   │   ├── new/         # New booking
│   │   │   ├── pos/         # POS billing
│   │   │   └── calendar/    # Calendar view
│   │   ├── appointments/     # Appointments list
│   │   ├── customers/        # Customer management
│   │   ├── staff/           # Staff management
│   │   ├── services/        # Service catalog
│   │   ├── inventory/       # Inventory management
│   │   ├── expenses/        # Expense tracking
│   │   ├── reports/         # Reports & analytics
│   │   ├── membership/      # Membership plans
│   │   ├── loyalty/         # Loyalty program
│   │   ├── discounts/       # Discount management
│   │   ├── notifications/   # Notification center
│   │   ├── settings/        # Settings
│   │   └── profile/         # User profile
│   ├── components/           # Reusable components
│   │   ├── layout/          # Layout components
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── forms/           # Form components
│   │   │   ├── AppointmentForm.tsx
│   │   │   ├── ClientForm.tsx
│   │   │   ├── ServiceForm.tsx
│   │   │   └── StaffForm.tsx
│   │   └── ui/              # UI components
│   │       ├── Modal.tsx
│   │       ├── Toast.tsx
│   │       ├── Loader.tsx
│   │       └── ThemeToggle.tsx
│   ├── lib/                  # Utility libraries
│   │   ├── api.ts           # API client
│   │   └── utils.ts         # Helper functions
│   ├── store/               # Zustand stores
│   │   ├── authStore.ts
│   │   ├── bookingStore.ts
│   │   └── themeStore.ts
│   ├── types/               # TypeScript types
│   │   ├── index.ts
│   │   ├── booking.ts
│   │   ├── customer.ts
│   │   └── service.ts
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useBooking.ts
│   │   └── useToast.ts
│   ├── constants/           # Constants and configs
│   │   └── index.ts
│   ├── styles/              # Global styles
│   │   └── globals.css
│   └── utils/               # Utility functions
│       ├── formatters.ts
│       └── validators.ts
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore rules
├── next.config.js          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies
├── DESIGN.md               # Design documentation
├── FRONTEND.md             # This file
└── INFO.md                 # Project info
```

---

## ✨ Features

### 1. Dashboard
- KPI overview (revenue, bookings, customers)
- Recent appointments
- Revenue charts
- Quick actions

### 2. Booking Management
- **New Booking**: Multi-step booking form
- **POS Billing**: Walk-in customer billing
- **Calendar View**: Visual appointment calendar
- **Appointments List**: All appointments with filters

### 3. Customer Management
- Customer profiles
- Booking history
- Loyalty points
- Membership status
- Package tracking

### 4. Staff Management
- Staff profiles
- Schedule management
- Performance tracking
- Commission calculation

### 5. Service Catalog
- Service categories
- Pricing management
- Duration settings
- Combo offers

### 6. Inventory Management
- Product catalog
- Stock tracking
- Low stock alerts
- Reorder management

### 7. Financial Management
- Expense tracking
- Payment methods
- Daily reconciliation
- Transaction history

### 8. Reports & Analytics
- Business trends
- Stylist progress
- Revenue reports
- Customer analytics

### 9. Membership & Loyalty
- Membership plans (Silver, Gold, Platinum)
- Loyalty points system
- Package management
- Referral tracking

### 10. Notifications
- WhatsApp integration
- Booking confirmations
- Appointment reminders
- Birthday greetings

---

## 🗺️ Pages & Routes

### Public Routes
```
/auth/login              → Login page
/auth/otp                → OTP verification
/auth/magic-link         → Magic link login
```

### Protected Routes (Require Authentication)

#### Dashboard
```
/dashboard               → Main dashboard with KPIs
```

#### Booking
```
/booking                 → Booking overview
/booking/new             → Create new booking
/booking/pos             → POS billing for walk-ins
/booking/calendar        → Calendar view of appointments
```

#### Management
```
/appointments            → All appointments list
/customers               → Customer management
/clients                 → Client profiles (alias)
/staff                   → Staff management
/services                → Service catalog
```

#### Inventory & Expenses
```
/inventory               → Inventory management
/inventory/reorder       → Reorder alerts
/expenses                → Expense tracking
```

#### Financial
```
/invoices                → Invoice management
/reports                 → Reports hub
/reports/daily-reconciliation
/reports/transactions
/reports/business-trend
/reports/stylist-progress
/analytics               → Analytics dashboard
```

#### Programs
```
/membership              → Membership overview
/membership/plans        → Membership plans
/membership/packages     → Package management
/loyalty                 → Loyalty program
/discounts               → Discount management
```

#### System
```
/notifications           → Notification center
/settings                → System settings
/profile                 → User profile
```

---

## 🧩 Components

### Layout Components

#### Header
```tsx
// src/components/layout/Header.tsx
- User profile dropdown
- Notifications bell
- Search bar
- Theme toggle
```

#### Sidebar
```tsx
// src/components/layout/Sidebar.tsx
- Navigation menu
- Active route highlighting
- Collapsible sections
- Role-based menu items
```

### Form Components

#### AppointmentForm
```tsx
// src/components/forms/AppointmentForm.tsx
- Service selection
- Staff assignment
- Date/time picker
- Customer selection
- Payment method
```

#### ClientForm
```tsx
// src/components/forms/ClientForm.tsx
- Personal information
- Contact details
- Preferences
- Notes
```

#### ServiceForm
```tsx
// src/components/forms/ServiceForm.tsx
- Service name
- Category
- Price
- Duration
- Description
```

#### StaffForm
```tsx
// src/components/forms/StaffForm.tsx
- Staff details
- Role assignment
- Schedule
- Commission rate
```

### UI Components

#### Modal
```tsx
// src/components/ui/Modal.tsx
<Modal isOpen={isOpen} onClose={onClose}>
  <Modal.Header>Title</Modal.Header>
  <Modal.Body>Content</Modal.Body>
  <Modal.Footer>Actions</Modal.Footer>
</Modal>
```

#### Toast
```tsx
// src/components/ui/Toast.tsx
toast.success('Booking created!')
toast.error('Failed to save')
toast.info('New notification')
toast.warning('Low stock alert')
```

#### Loader
```tsx
// src/components/ui/Loader.tsx
<Loader size="sm" />
<Loader size="md" />
<Loader size="lg" />
```

#### ThemeToggle
```tsx
// src/components/ui/ThemeToggle.tsx
<ThemeToggle />
```

---

## 🗄️ State Management

### Zustand Stores

#### Auth Store
```typescript
// src/store/authStore.ts
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
}
```

#### Booking Store
```typescript
// src/store/bookingStore.ts
interface BookingState {
  bookings: Booking[]
  selectedBooking: Booking | null
  fetchBookings: () => Promise<void>
  createBooking: (data: BookingData) => Promise<void>
  updateBooking: (id: string, data: Partial<BookingData>) => Promise<void>
  deleteBooking: (id: string) => Promise<void>
}
```

#### Theme Store
```typescript
// src/store/themeStore.ts
interface ThemeState {
  theme: 'light' | 'dark'
  toggleTheme: () => void
  setTheme: (theme: 'light' | 'dark') => void
}
```

### Usage Example
```typescript
import { useAuthStore } from '@/store/authStore'

function Component() {
  const { user, login, logout } = useAuthStore()
  
  return (
    <div>
      {user ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={() => login(credentials)}>Login</button>
      )}
    </div>
  )
}
```

---

## 🔌 API Integration

### API Client Setup
```typescript
// src/lib/api.ts
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

export default api
```

### API Endpoints

#### Authentication
```typescript
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
POST   /api/auth/refresh
```

#### Bookings
```typescript
GET    /api/bookings
POST   /api/bookings
GET    /api/bookings/:id
PUT    /api/bookings/:id
DELETE /api/bookings/:id
GET    /api/bookings/calendar
```

#### Customers
```typescript
GET    /api/customers
POST   /api/customers
GET    /api/customers/:id
PUT    /api/customers/:id
DELETE /api/customers/:id
```

#### Services
```typescript
GET    /api/services
POST   /api/services
GET    /api/services/:id
PUT    /api/services/:id
DELETE /api/services/:id
```

### API Usage Example
```typescript
// Fetch bookings
const fetchBookings = async () => {
  try {
    const response = await api.get('/bookings')
    return response.data
  } catch (error) {
    console.error('Failed to fetch bookings:', error)
    throw error
  }
}

// Create booking
const createBooking = async (data: BookingData) => {
  try {
    const response = await api.post('/bookings', data)
    return response.data
  } catch (error) {
    console.error('Failed to create booking:', error)
    throw error
  }
}
```

---

## 🔐 Authentication

### NextAuth Configuration
```typescript
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Authenticate with backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        })
        
        if (response.ok) {
          const user = await response.json()
          return user
        }
        return null
      }
    })
  ],
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      session.user.role = token.role
      return session
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

### Protected Routes
```typescript
// src/middleware.ts
import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/auth/login',
  },
})

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/booking/:path*',
    '/customers/:path*',
    // ... other protected routes
  ],
}
```

---

## 🎨 Styling

### Tailwind Configuration
```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#7c3aed',
        secondary: '#10b981',
      },
    },
  },
  plugins: [],
}
export default config
```

### Global Styles
```css
/* src/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: #7c3aed;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --border: #e5e7eb;
  --bg: #ffffff;
  --hover: #f9fafb;
}

.dark {
  --text-primary: #f9fafb;
  --text-secondary: #9ca3af;
  --border: #374151;
  --bg: #111827;
  --hover: #1f2937;
}
```

---

## 🚀 Development

### Prerequisites
```bash
Node.js 18+
npm or yarn
```

### Installation
```bash
# Navigate to frontend directory
cd CRM/crm-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Running Development Server
```bash
npm run dev
```

Application will run at `http://localhost:3000`

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 📦 Build & Deploy

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Environment Variables
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secret-key
```

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [React Hook Form](https://react-hook-form.com/)
- [Recharts Documentation](https://recharts.org/)

---

**Built for Hair Ahmedabad** · Ahmedabad, Gujarat, India
