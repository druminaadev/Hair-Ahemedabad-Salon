# 🚀 QUICK SETUP GUIDE

## Prerequisites
- Node.js 18+ installed
- npm or yarn installed
- Backend API running at http://localhost:5000

## Installation Steps

### 1. Install Dependencies
```bash
cd "/home/dipak/Downloads/2/Money/Salon/Form Scrach Salon/Crm-Frontend"
npm install
```

### 2. Install Additional Required Packages
```bash
npm install react-hook-form zod @hookform/resolvers recharts clsx date-fns
```

### 3. Create Environment File
```bash
cp .env.example .env.local
```

### 4. Configure Environment Variables
Edit `.env.local` and add:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 5. Run Development Server
```bash
npm run dev
```

### 6. Open Browser
Navigate to: http://localhost:3000

### 7. Login
Use default credentials:
- **Email**: admin@hairahmedabad.com
- **Password**: Admin@123

---

## 🔧 Troubleshooting

### Issue: Module not found errors
**Solution**: Run `npm install` again

### Issue: Port 3000 already in use
**Solution**: 
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### Issue: Cannot connect to backend
**Solution**:
1. Ensure backend is running at http://localhost:5000
2. Check .env.local file has correct API URL
3. Restart frontend: `npm run dev`

### Issue: Dark mode not working
**Solution**: Clear browser localStorage and refresh

---

## 📦 Build for Production

```bash
# Build the application
npm run build

# Test production build locally
npm run start

# Deploy to Vercel
vercel --prod
```

---

## ✅ Verification Checklist

After setup, verify:
- [ ] Application runs without errors
- [ ] Login page loads
- [ ] Can login with default credentials
- [ ] Dashboard displays
- [ ] Sidebar navigation works
- [ ] Theme toggle works
- [ ] Customer page loads
- [ ] POS billing page loads

---

## 🎯 Next Development Steps

1. **Complete Booking System**
   - New booking form
   - Calendar view
   - Appointments list

2. **Build Staff Management**
   - Staff CRUD
   - Schedule management

3. **Create Service Catalog**
   - Service CRUD
   - Category management

4. **Implement Reports**
   - Daily reconciliation
   - Business trends

---

## 📞 Support

For issues or questions:
- Check IMPLEMENTATION_STATUS.md
- Review documentation files
- Contact development team

---

**Project**: SalonPro CRM Frontend  
**Version**: 0.1.0  
**Status**: Development
