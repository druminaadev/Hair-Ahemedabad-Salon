# 🏗️ PROJECT STRUCTURE - COMPLETE ARCHITECTURE

## 📁 Monorepo Structure

```
salon-booking-platform/
├── apps/
│   ├── customer-mobile/          # React Native - Customer App
│   ├── salon-mobile/              # React Native - Salon Owner App
│   ├── web-dashboard/             # Next.js - Salon Owner Dashboard
│   ├── admin-panel/               # Next.js - Admin Panel
│   └── api/                       # Node.js - Backend API
├── packages/
│   ├── ui/                        # Shared UI components (React Native)
│   ├── web-ui/                    # Shared Web components (React)
│   ├── types/                     # Shared TypeScript types
│   ├── utils/                     # Shared utilities
│   ├── config/                    # Shared configurations
│   └── api-client/                # Shared API client
├── infrastructure/
│   ├── terraform/                 # AWS Infrastructure as Code
│   ├── docker/                    # Docker configurations
│   └── k8s/                       # Kubernetes configs (future)
├── docs/
│   ├── api/                       # API documentation
│   ├── architecture/              # Architecture diagrams
│   └── guides/                    # Development guides
├── scripts/
│   ├── setup/                     # Setup scripts
│   ├── deploy/                    # Deployment scripts
│   └── migrations/                # Database migrations
├── .github/
│   └── workflows/                 # CI/CD workflows
├── turbo.json                     # Turborepo configuration
├── package.json                   # Root package.json
├── pnpm-workspace.yaml            # PNPM workspace config
├── docker-compose.yml             # Local development
└── README.md
```

---

## 📱 CUSTOMER MOBILE APP STRUCTURE

```
apps/customer-mobile/
├── src/
│   ├── app/                       # App entry point
│   │   ├── App.tsx
│   │   ├── store.ts              # Zustand root store
│   │   └── queryClient.ts        # React Query client
│   ├── navigation/
│   │   ├── RootNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   ├── MainNavigator.tsx
│   │   ├── types.ts
│   │   └── linking.ts            # Deep linking config
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── SplashScreen.tsx
│   │   │   ├── OnboardingScreen.tsx
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── OTPScreen.tsx
│   │   │   └── PermissionsScreen.tsx
│   │   ├── home/
│   │   │   ├── HomeScreen.tsx
│   │   │   └── SearchScreen.tsx
│   │   ├── discovery/
│   │   │   ├── SalonListScreen.tsx
│   │   │   ├── SalonDetailScreen.tsx
│   │   │   ├── ServiceDetailScreen.tsx
│   │   │   └── MapViewScreen.tsx
│   │   ├── booking/
│   │   │   ├── ServiceSelectionScreen.tsx
│   │   │   ├── StaffSelectionScreen.tsx
│   │   │   ├── SlotSelectionScreen.tsx
│   │   │   ├── BookingSummaryScreen.tsx
│   │   │   ├── PaymentScreen.tsx
│   │   │   ├── BookingSuccessScreen.tsx
│   │   │   ├── BookingHistoryScreen.tsx
│   │   │   ├── BookingDetailScreen.tsx
│   │   │   └── RescheduleScreen.tsx
│   │   ├── wallet/
│   │   │   ├── WalletScreen.tsx
│   │   │   ├── AddMoneyScreen.tsx
│   │   │   ├── TransactionHistoryScreen.tsx
│   │   │   └── ReferralScreen.tsx
│   │   ├── profile/
│   │   │   ├── ProfileScreen.tsx
│   │   │   ├── EditProfileScreen.tsx
│   │   │   ├── AddressesScreen.tsx
│   │   │   ├── AddAddressScreen.tsx
│   │   │   └── SettingsScreen.tsx
│   │   ├── reviews/
│   │   │   ├── ReviewListScreen.tsx
│   │   │   └── WriteReviewScreen.tsx
│   │   ├── support/
│   │   │   ├── HelpScreen.tsx
│   │   │   ├── FAQScreen.tsx
│   │   │   ├── ChatScreen.tsx
│   │   │   └── TicketsScreen.tsx
│   │   └── notifications/
│   │       └── NotificationsScreen.tsx
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Chip.tsx
│   │   │   ├── Divider.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorState.tsx
│   │   │   └── BottomSheet.tsx
│   │   ├── booking/
│   │   │   ├── ServiceCard.tsx
│   │   │   ├── StaffCard.tsx
│   │   │   ├── SlotPicker.tsx
│   │   │   ├── BookingCard.tsx
│   │   │   └── PriceBreakdown.tsx
│   │   ├── salon/
│   │   │   ├── SalonCard.tsx
│   │   │   ├── SalonHeader.tsx
│   │   │   ├── ServiceList.tsx
│   │   │   ├── ReviewCard.tsx
│   │   │   └── GalleryGrid.tsx
│   │   ├── wallet/
│   │   │   ├── WalletCard.tsx
│   │   │   ├── TransactionItem.tsx
│   │   │   └── LoyaltyCard.tsx
│   │   └── layout/
│   │       ├── Screen.tsx
│   │       ├── Header.tsx
│   │       └── TabBar.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useBooking.ts
│   │   ├── useWallet.ts
│   │   ├── useLocation.ts
│   │   ├── useBiometrics.ts
│   │   ├── useNotifications.ts
│   │   └── useDeepLink.ts
│   ├── services/
│   │   ├── api/
│   │   │   ├── auth.ts
│   │   │   ├── salons.ts
│   │   │   ├── bookings.ts
│   │   │   ├── wallet.ts
│   │   │   ├── reviews.ts
│   │   │   └── notifications.ts
│   │   ├── storage/
│   │   │   └── mmkv.ts
│   │   ├── location/
│   │   │   └── geolocation.ts
│   │   ├── payment/
│   │   │   └── razorpay.ts
│   │   ├── notifications/
│   │   │   └── fcm.ts
│   │   └── analytics/
│   │       ├── mixpanel.ts
│   │       └── firebase.ts
│   ├── store/
│   │   ├── auth/
│   │   │   ├── authStore.ts
│   │   │   └── types.ts
│   │   ├── booking/
│   │   │   ├── bookingStore.ts
│   │   │   └── types.ts
│   │   ├── cart/
│   │   │   └── cartStore.ts
│   │   └── app/
│   │       └── appStore.ts
│   ├── utils/
│   │   ├── date.ts
│   │   ├── currency.ts
│   │   ├── validation.ts
│   │   ├── formatting.ts
│   │   └── helpers.ts
│   ├── constants/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── config.ts
│   ├── theme/
│   │   ├── index.ts
│   │   ├── light.ts
│   │   └── dark.ts
│   ├── types/
│   │   ├── navigation.ts
│   │   ├── models.ts
│   │   └── api.ts
│   └── assets/
│       ├── images/
│       ├── icons/
│       ├── animations/
│       └── fonts/
├── android/
├── ios/
├── __tests__/
├── e2e/
├── .env.example
├── app.json
├── babel.config.js
├── metro.config.js
├── tsconfig.json
└── package.json
```

---

## 🏪 SALON MOBILE APP STRUCTURE

```
apps/salon-mobile/
├── src/
│   ├── screens/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   │   └── DashboardScreen.tsx
│   │   ├── bookings/
│   │   │   ├── BookingListScreen.tsx
│   │   │   ├── BookingDetailScreen.tsx
│   │   │   └── CreateBookingScreen.tsx
│   │   ├── staff/
│   │   │   ├── StaffListScreen.tsx
│   │   │   ├── StaffDetailScreen.tsx
│   │   │   └── AddStaffScreen.tsx
│   │   ├── services/
│   │   │   ├── ServiceListScreen.tsx
│   │   │   └── AddServiceScreen.tsx
│   │   ├── availability/
│   │   │   └── AvailabilityScreen.tsx
│   │   ├── analytics/
│   │   │   ├── RevenueScreen.tsx
│   │   │   └── InsightsScreen.tsx
│   │   └── profile/
│   │       └── ProfileScreen.tsx
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── MetricCard.tsx
│   │   │   ├── BookingList.tsx
│   │   │   └── QuickActions.tsx
│   │   ├── bookings/
│   │   │   ├── BookingCard.tsx
│   │   │   └── StatusChip.tsx
│   │   └── charts/
│   │       ├── LineChart.tsx
│   │       └── BarChart.tsx
│   └── [similar structure to customer app]
├── android/
├── ios/
└── package.json
```

---

## 💻 WEB DASHBOARD STRUCTURE (Next.js)

```
apps/web-dashboard/
├── src/
│   ├── app/                       # App Router
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── bookings/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── customers/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── staff/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── services/
│   │   │   │   └── page.tsx
│   │   │   ├── reports/
│   │   │   │   ├── revenue/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── bookings/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── customers/
│   │   │   │       └── page.tsx
│   │   │   ├── marketing/
│   │   │   │   ├── coupons/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── campaigns/
│   │   │   │       └── page.tsx
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── [...nextauth]/
│   │   │           └── route.ts
│   │   └── layout.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── MobileNav.tsx
│   │   ├── dashboard/
│   │   │   ├── StatCard.tsx
│   │   │   ├── RecentBookings.tsx
│   │   │   ├── RevenueChart.tsx
│   │   │   └── ActivityFeed.tsx
│   │   ├── bookings/
│   │   │   ├── BookingTable.tsx
│   │   │   ├── BookingFilters.tsx
│   │   │   ├── BookingCalendar.tsx
│   │   │   ├── BookingDetail.tsx
│   │   │   └── CreateBookingModal.tsx
│   │   ├── customers/
│   │   │   ├── CustomerTable.tsx
│   │   │   ├── CustomerDetail.tsx
│   │   │   └── CustomerHistory.tsx
│   │   ├── staff/
│   │   │   ├── StaffTable.tsx
│   │   │   ├── StaffForm.tsx
│   │   │   └── AvailabilityCalendar.tsx
│   │   ├── reports/
│   │   │   ├── RevenueChart.tsx
│   │   │   ├── BookingTrends.tsx
│   │   │   └── CustomerInsights.tsx
│   │   ├── forms/
│   │   │   ├── ServiceForm.tsx
│   │   │   ├── CouponForm.tsx
│   │   │   └── SettingsForm.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Select.tsx
│   │       ├── Table.tsx
│   │       ├── Modal.tsx
│   │       ├── Card.tsx
│   │       └── Badge.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── utils.ts
│   │   └── validators.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useBookings.ts
│   │   ├── useCustomers.ts
│   │   └── useReports.ts
│   ├── store/
│   │   ├── authStore.ts
│   │   └── appStore.ts
│   ├── types/
│   │   ├── api.ts
│   │   └── models.ts
│   └── styles/
│       └── globals.css
├── public/
├── .env.example
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 🔧 ADMIN PANEL STRUCTURE

```
apps/admin-panel/
├── src/
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   ├── users/
│   │   │   ├── salons/
│   │   │   ├── payments/
│   │   │   ├── refunds/
│   │   │   ├── analytics/
│   │   │   ├── support/
│   │   │   ├── cms/
│   │   │   ├── roles/
│   │   │   ├── audit-logs/
│   │   │   └── settings/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── users/
│   │   │   ├── UserTable.tsx
│   │   │   ├── UserDetail.tsx
│   │   │   └── RoleManager.tsx
│   │   ├── salons/
│   │   │   ├── SalonTable.tsx
│   │   │   ├── SalonApproval.tsx
│   │   │   └── CommissionSettings.tsx
│   │   ├── payments/
│   │   │   ├── PaymentTable.tsx
│   │   │   └── RefundManager.tsx
│   │   └── analytics/
│   │       ├── PlatformMetrics.tsx
│   │       └── UserBehavior.tsx
│   └── [similar structure to web dashboard]
└── package.json
```

---

## 🔌 BACKEND API STRUCTURE

```
apps/api/
├── src/
│   ├── index.ts                   # App entry point
│   ├── server.ts                  # Express server
│   ├── config/
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   ├── aws.ts
│   │   ├── payment.ts
│   │   └── env.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.validation.ts
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   ├── otp.strategy.ts
│   │   │   │   └── google.strategy.ts
│   │   │   └── dto/
│   │   │       ├── login.dto.ts
│   │   │       └── verify-otp.dto.ts
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.routes.ts
│   │   │   ├── users.repository.ts
│   │   │   └── dto/
│   │   ├── salons/
│   │   │   ├── salons.controller.ts
│   │   │   ├── salons.service.ts
│   │   │   ├── salons.routes.ts
│   │   │   ├── salons.repository.ts
│   │   │   └── dto/
│   │   ├── services/
│   │   │   ├── services.controller.ts
│   │   │   ├── services.service.ts
│   │   │   ├── services.routes.ts
│   │   │   └── services.repository.ts
│   │   ├── staff/
│   │   │   ├── staff.controller.ts
│   │   │   ├── staff.service.ts
│   │   │   ├── staff.routes.ts
│   │   │   └── staff.repository.ts
│   │   ├── bookings/
│   │   │   ├── bookings.controller.ts
│   │   │   ├── bookings.service.ts
│   │   │   ├── bookings.routes.ts
│   │   │   ├── bookings.repository.ts
│   │   │   ├── slot.service.ts
│   │   │   ├── state-machine.ts
│   │   │   └── dto/
│   │   ├── payments/
│   │   │   ├── payments.controller.ts
│   │   │   ├── payments.service.ts
│   │   │   ├── payments.routes.ts
│   │   │   ├── razorpay.service.ts
│   │   │   └── webhook.controller.ts
│   │   ├── wallet/
│   │   │   ├── wallet.controller.ts
│   │   │   ├── wallet.service.ts
│   │   │   ├── wallet.routes.ts
│   │   │   ├── ledger.service.ts
│   │   │   └── loyalty.service.ts
│   │   ├── reviews/
│   │   │   ├── reviews.controller.ts
│   │   │   ├── reviews.service.ts
│   │   │   └── reviews.routes.ts
│   │   ├── notifications/
│   │   │   ├── notifications.controller.ts
│   │   │   ├── notifications.service.ts
│   │   │   ├── notifications.routes.ts
│   │   │   ├── fcm.service.ts
│   │   │   └── templates.ts
│   │   ├── search/
│   │   │   ├── search.controller.ts
│   │   │   ├── search.service.ts
│   │   │   ├── search.routes.ts
│   │   │   └── elasticsearch.service.ts
│   │   ├── coupons/
│   │   │   ├── coupons.controller.ts
│   │   │   ├── coupons.service.ts
│   │   │   └── coupons.routes.ts
│   │   ├── memberships/
│   │   │   ├── memberships.controller.ts
│   │   │   ├── memberships.service.ts
│   │   │   └── memberships.routes.ts
│   │   └── support/
│   │       ├── support.controller.ts
│   │       ├── support.service.ts
│   │       └── support.routes.ts
│   ├── common/
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   ├── validation.middleware.ts
│   │   │   ├── rate-limit.middleware.ts
│   │   │   ├── logger.middleware.ts
│   │   │   └── rbac.middleware.ts
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   └── role.guard.ts
│   │   ├── decorators/
│   │   │   ├── auth.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── interceptors/
│   │   │   └── transform.interceptor.ts
│   │   └── pipes/
│   │       └── validation.pipe.ts
│   ├── shared/
│   │   ├── database/
│   │   │   ├── prisma.service.ts
│   │   │   └── migrations/
│   │   ├── cache/
│   │   │   └── redis.service.ts
│   │   ├── queue/
│   │   │   ├── queue.service.ts
│   │   │   └── processors/
│   │   │       ├── email.processor.ts
│   │   │       ├── sms.processor.ts
│   │   │       └── notification.processor.ts
│   │   ├── storage/
│   │   │   └── s3.service.ts
│   │   ├── email/
│   │   │   ├── email.service.ts
│   │   │   └── templates/
│   │   ├── sms/
│   │   │   └── sms.service.ts
│   │   ├── maps/
│   │   │   └── google-maps.service.ts
│   │   └── logger/
│   │       └── logger.service.ts
│   ├── utils/
│   │   ├── date.util.ts
│   │   ├── crypto.util.ts
│   │   ├── validation.util.ts
│   │   └── helpers.util.ts
│   ├── types/
│   │   ├── express.d.ts
│   │   └── models.ts
│   └── constants/
│       ├── errors.ts
│       ├── messages.ts
│       └── config.ts
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seeds/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
│   └── swagger.yaml
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── tsconfig.json
└── package.json
```

---

## 📦 SHARED PACKAGES

### packages/types/
```
packages/types/
├── src/
│   ├── api/
│   │   ├── requests.ts
│   │   └── responses.ts
│   ├── models/
│   │   ├── user.ts
│   │   ├── salon.ts
│   │   ├── booking.ts
│   │   ├── payment.ts
│   │   └── wallet.ts
│   ├── enums/
│   │   ├── booking-status.ts
│   │   ├── payment-status.ts
│   │   └── user-role.ts
│   └── index.ts
├── tsconfig.json
└── package.json
```

### packages/utils/
```
packages/utils/
├── src/
│   ├── date/
│   │   ├── format.ts
│   │   └── parse.ts
│   ├── currency/
│   │   └── format.ts
│   ├── validation/
│   │   ├── phone.ts
│   │   ├── email.ts
│   │   └── schemas.ts
│   └── index.ts
└── package.json
```

### packages/api-client/
```
packages/api-client/
├── src/
│   ├── client.ts
│   ├── endpoints/
│   │   ├── auth.ts
│   │   ├── salons.ts
│   │   ├── bookings.ts
│   │   └── wallet.ts
│   ├── interceptors.ts
│   └── index.ts
└── package.json
```

---

## 🏗️ INFRASTRUCTURE

### infrastructure/terraform/
```
infrastructure/terraform/
├── modules/
│   ├── vpc/
│   ├── ecs/
│   ├── rds/
│   ├── elasticache/
│   ├── s3/
│   ├── cloudfront/
│   └── monitoring/
├── environments/
│   ├── dev/
│   ├── staging/
│   └── prod/
├── main.tf
├── variables.tf
└── outputs.tf
```

### infrastructure/docker/
```
infrastructure/docker/
├── api/
│   └── Dockerfile
├── web/
│   └── Dockerfile
└── nginx/
    └── Dockerfile
```

---

## 🔄 CI/CD

### .github/workflows/
```
.github/workflows/
├── api-ci.yml
├── api-cd.yml
├── mobile-ci.yml
├── mobile-cd.yml
├── web-ci.yml
├── web-cd.yml
└── infra-deploy.yml
```

---

## 📊 DATABASE SCHEMA (Prisma)

Location: `apps/api/prisma/schema.prisma`

Contains:
- 25+ models
- Relationships
- Indexes
- Enums
- Full-text search
- Geospatial data

---

## 🚀 Getting Started

1. Clone repository
2. Install dependencies: `pnpm install`
3. Setup environment: `cp .env.example .env`
4. Start services: `docker-compose up -d`
5. Run migrations: `pnpm db:migrate`
6. Start dev: `pnpm dev`

---

This structure ensures:
✅ Clean separation of concerns
✅ Reusable components
✅ Scalable architecture
✅ Easy navigation
✅ Type safety across apps
✅ Shared business logic
✅ Independent deployments
✅ Easy testing
✅ Future microservice migration

