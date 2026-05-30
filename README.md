# 💼 SalonPro CRM Frontend

Admin dashboard for comprehensive salon management built with Next.js 14, TypeScript, and Tailwind CSS.

---

## 📚 Documentation

| File | Description |
|------|-------------|
| **[INFO.md](./INFO.md)** | 📖 Start here! Project overview, setup guide, and how to connect to backend |
| **[FRONTEND.md](./FRONTEND.md)** | 💻 Complete technical documentation, architecture, and API integration |
| **[DESIGN.md](./DESIGN.md)** | 🎨 Design system, components, and UI patterns |

---

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with backend URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🎯 Features

- 📅 **Booking Management** - Appointments, calendar, POS billing
- 👥 **Customer Management** - Profiles, history, loyalty points
- 💰 **Financial Tracking** - Payments, expenses, reports
- 📊 **Analytics** - Business insights and trends
- 📦 **Inventory** - Stock management and alerts
- 🎁 **Loyalty Programs** - Memberships and packages
- 📱 **Notifications** - WhatsApp integration
- 🌓 **Dark Mode** - Full theme support

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP**: Axios

---

## 📁 Project Structure

```
src/
├── app/              # Next.js pages (App Router)
│   ├── dashboard/   # Main dashboard
│   ├── booking/     # Booking management
│   ├── customers/   # Customer management
│   ├── reports/     # Analytics & reports
│   └── ...
├── components/       # Reusable components
│   ├── layout/      # Header, Sidebar
│   ├── forms/       # Form components
│   └── ui/          # UI components
├── lib/             # Utilities & API client
├── store/           # Zustand stores
├── types/           # TypeScript types
└── styles/          # Global styles
```

---

## 🔗 Backend Connection

The frontend connects to the backend API via Axios:

```typescript
// src/lib/api.ts
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})
```

**Required**: Backend must be running at `http://localhost:5000`

See [INFO.md](./INFO.md) for detailed connection guide.

---

## 📦 Available Scripts

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 🔐 Default Login

- **Email**: admin@hairahmedabad.com
- **Password**: Admin@123

---

## 📖 Documentation Guide

### New to the project?
1. Read **[INFO.md](./INFO.md)** - Understand what this is and how to set it up
2. Read **[FRONTEND.md](./FRONTEND.md)** - Learn the technical architecture
3. Read **[DESIGN.md](./DESIGN.md)** - Understand the design system

### Need to:
- **Setup the project?** → [INFO.md](./INFO.md#quick-start-guide)
- **Connect to backend?** → [INFO.md](./INFO.md#how-to-connect-to-backend)
- **Understand architecture?** → [FRONTEND.md](./FRONTEND.md#project-structure)
- **Make API calls?** → [FRONTEND.md](./FRONTEND.md#api-integration)
- **Style components?** → [DESIGN.md](./DESIGN.md#component-design-patterns)
- **Use colors/fonts?** → [DESIGN.md](./DESIGN.md#design-system)

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
vercel
```

### Environment Variables

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Make changes
3. Commit: `git commit -m "feat: description"`
4. Push: `git push origin feature/name`
5. Create Pull Request

---

## 📞 Support

- 📖 Check documentation files
- 🐛 Report issues via GitHub
- 💬 Contact development team

---

## 📄 License

Proprietary - All rights reserved by Hair Ahmedabad

---

**Built for Hair Ahmedabad** · Ahmedabad, Gujarat, India
