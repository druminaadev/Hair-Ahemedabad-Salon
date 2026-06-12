#  SalonBooking - Customer Mobile App

Production-ready React Native mobile application for salon booking platform.

---

##  Overview

This is the customer-facing mobile app built with React Native and Expo, following enterprise-grade architecture and best practices.

### Features
-  OTP-based authentication
-  Search & discover nearby salons
-  Real-time slot booking
-  Integrated payment (Razorpay)
-  Wallet & loyalty points
-  Reviews & ratings
-  Push notifications
-  Biometric authentication
-  Dark mode support

---

## ️ Tech Stack

- **Framework**: React Native 0.73 with Expo 50
- **Language**: TypeScript 5+
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **Navigation**: React Navigation 6
- **UI Library**: React Native Paper
- **Storage**: MMKV (encrypted)
- **Forms**: React Hook Form + Zod
- **Maps**: React Native Maps
- **Animations**: Reanimated 3

---

##  Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── common/      # Button, Input, Card, etc.
│   ├── booking/     # Booking-specific components
│   ├── salon/       # Salon-specific components
│   └── layout/      # Layout components
├── screens/         # All app screens
│   ├── auth/        # Authentication screens
│   ├── home/        # Home & discovery
│   ├── booking/     # Booking flow
│   ├── bookings/    # Booking management
│   ├── wallet/      # Wallet & transactions
│   └── profile/     # Profile & settings
├── navigation/      # Navigation setup
├── services/        # External services
│   ├── api/         # API clients
│   ├── storage/     # Storage service
│   ├── location/    # Location service
│   └── payment/     # Payment service
├── store/           # Zustand stores
├── hooks/           # Custom hooks
├── utils/           # Utility functions
├── constants/       # Constants & config
├── types/           # TypeScript types
└── theme/           # Theme configuration
```

---

##  Quick Start

### Prerequisites
- Node.js >= 18
- npm >= 9
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

```bash
# Navigate to project
cd Mobile-App/customer-mobile

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your backend URL and API keys
```

### Environment Variables

```env
API_URL=http://localhost:5000/api/v1
RAZORPAY_KEY=rzp_test_xxxxxxxxxxxx
GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXX
```

### Run Development

```bash
# Start Expo
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

---

##  Design System

### Colors
Primary colors defined in `src/constants/colors.ts`:
- Primary: `#6366F1` (Indigo)
- Secondary: `#EC4899` (Pink)
- Success: `#10B981` (Green)
- Error: `#EF4444` (Red)

### Typography
Font sizes and weights in `src/constants/typography.ts`

### Spacing
Consistent spacing values in `src/constants/spacing.ts`

---

##  API Integration

### Authentication

```typescript
import { authApi } from '@/services/api/auth';

// Send OTP
await authApi.sendOTP('9876543210', '+91');

// Verify OTP
await authApi.verifyOTP('9876543210', '123456', deviceId);
```

### Salons

```typescript
import { salonsApi } from '@/services/api/salons';

// Search salons
const salons = await salonsApi.search({
  latitude: 23.0225,
  longitude: 72.5714,
  radius: 5,
  page: 1,
  limit: 20
});

// Get salon details
const salon = await salonsApi.getById(salonId);
```

### Bookings

```typescript
import { bookingsApi } from '@/services/api/bookings';

// Initiate booking
const booking = await bookingsApi.initiate({
  salonId,
  staffId,
  date: '2024-02-15',
  startTime: '10:00',
  serviceIds: ['service-id-1'],
  idempotencyKey: 'unique-key'
});

// Create payment order
const order = await bookingsApi.createPaymentOrder(bookingId);
```

---

## ️ State Management

### Auth Store

```typescript
import { useAuthStore } from '@/store/authStore';

const { user, isAuthenticated, login, logout } = useAuthStore();

// Login
await login('9876543210', '123456');

// Logout
await logout();
```

### Booking Store

```typescript
import { useBookingStore } from '@/store/bookingStore';

const { 
  selectedServices, 
  addService, 
  removeService,
  getTotalAmount 
} = useBookingStore();

// Add service
addService(service);

// Get total
const total = getTotalAmount();
```

---

##  Components

### Button

```typescript
import { Button } from '@/components/common/Button';

<Button
  title="Book Now"
  onPress={handlePress}
  variant="primary"    // primary | secondary | outline | ghost
  size="medium"        // small | medium | large
  loading={isLoading}
  fullWidth
/>
```

### Input

```typescript
import { Input } from '@/components/common/Input';

<Input
  label="Phone Number"
  placeholder="Enter phone"
  value={phone}
  onChangeText={setPhone}
  keyboardType="phone-pad"
  error={errors.phone}
/>
```

### Card

```typescript
import { Card } from '@/components/common/Card';

<Card onPress={handlePress} elevation={2}>
  <Text>Content</Text>
</Card>
```

---

##  Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

---

##  Build & Deploy

### Development Build

```bash
# Android
eas build --profile development --platform android

# iOS
eas build --profile development --platform ios
```

### Production Build

```bash
# Android
eas build --profile production --platform android

# iOS
eas build --profile production --platform ios
```

### Submit to Stores

```bash
# Google Play Store
eas submit --platform android

# Apple App Store
eas submit --platform ios
```

---

##  Performance Targets

- Cold start: < 2 seconds
- Screen transition: < 300ms
- API calls: < 500ms (p95)
- Crash rate: < 0.1%

---

##  Security

- Encrypted local storage (MMKV)
- JWT with refresh token rotation
- Certificate pinning (production)
- Biometric authentication
- Secure API communication (HTTPS)
- No sensitive data in logs

---

##  Development Guidelines

### Code Style
- Follow TypeScript strict mode
- Use functional components with hooks
- Prefer composition over inheritance
- Keep components under 200 lines
- Extract business logic to custom hooks

### Naming Conventions
- Components: PascalCase (UserProfile.tsx)
- Files: camelCase (userService.ts)
- Constants: UPPER_SNAKE_CASE
- Hooks: use prefix (useAuth)

### Git Workflow
- Feature branches: `feature/booking-flow`
- Bug fixes: `fix/payment-issue`
- Commit format: `feat: add payment integration`

---

##  Debugging

### React Native Debugger

```bash
# Install
brew install --cask react-native-debugger

# Run
open "rndebugger://set-debugger-loc?host=localhost&port=19000"
```

### Reactotron

```bash
# Install
brew install --cask reactotron

# Connect in app
// Already configured in dev mode
```

---

##  Documentation

- [Implementation Guide](./IMPLEMENTATION_GUIDE.md)
- [API Specification](../../API_SPECIFICATION.md)
- [Database Schema](../../DATABASE_SCHEMA.md)
- [Security Guide](../../SECURITY_IMPLEMENTATION.md)

---

##  Contributing

1. Create feature branch
2. Make changes
3. Run tests: `npm test`
4. Run linter: `npm run lint:fix`
5. Commit with conventional commits
6. Create pull request

---

##  License

Proprietary - All rights reserved

---

##  Support

For issues or questions:
- Check documentation
- Create GitHub issue
- Contact development team

---

**Built with ️ for SalonBooking Platform**
