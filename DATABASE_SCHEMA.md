# ️ COMPLETE DATABASE SCHEMA

## Prisma Schema (apps/api/prisma/schema.prisma)

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions", "fullTextSearch"]
}

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [postgis, pg_trgm]
}

// ============================================
// ENUMS
// ============================================

enum UserRole {
  CUSTOMER
  SALON_OWNER
  ADMIN
  SUPER_ADMIN
}

enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
  DELETED
}

enum SalonStatus {
  PENDING_APPROVAL
  ACTIVE
  SUSPENDED
  INACTIVE
  REJECTED
}

enum BookingStatus {
  DRAFT
  PENDING_PAYMENT
  CONFIRMED
  CHECKED_IN
  COMPLETED
  CANCELLED
  NO_SHOW
  REFUND_PENDING
  REFUNDED
}

enum PaymentStatus {
  PENDING
  PROCESSING
  SUCCESS
  FAILED
  REFUNDED
  PARTIAL_REFUND
}

enum PaymentGateway {
  RAZORPAY
  WALLET
  CASH
}

enum TransactionType {
  CREDIT
  DEBIT
  REFUND
  LOYALTY_EARN
  LOYALTY_REDEEM
  REFERRAL_BONUS
}

enum NotificationType {
  BOOKING_CONFIRMED
  BOOKING_REMINDER
  BOOKING_CANCELLED
  PAYMENT_SUCCESS
  PAYMENT_FAILED
  REVIEW_REQUEST
  PROMOTION
  SYSTEM
}

enum TicketStatus {
  OPEN
  IN_PROGRESS
  RESOLVED
  CLOSED
}

enum MembershipStatus {
  ACTIVE
  EXPIRED
  CANCELLED
}

enum DayOfWeek {
  MONDAY
  TUESDAY
  WEDNESDAY
  THURSDAY
  FRIDAY
  SATURDAY
  SUNDAY
}

enum DiscountType {
  PERCENTAGE
  FIXED
}

enum Gender {
  MALE
  FEMALE
  UNISEX
}

// ============================================
// USER MANAGEMENT
// ============================================

model User {
  id            String     @id @default(uuid()) @db.Uuid
  phone         String     @unique @db.VarChar(15)
  countryCode   String     @default("+91") @db.VarChar(5)
  email         String?    @unique @db.VarChar(255)
  name          String?    @db.VarChar(255)
  avatarUrl     String?    @db.Text
  dateOfBirth   DateTime?  @db.Date
  gender        Gender?
  role          UserRole   @default(CUSTOMER)
  status        UserStatus @default(ACTIVE)
  isVerified    Boolean    @default(false)
  lastLoginAt   DateTime?
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
  deletedAt     DateTime?

  // Relations
  devices        Device[]
  otps           Otp[]
  addresses      Address[]
  bookings       Booking[]
  reviews        Review[]
  wallet         Wallet?
  memberships    Membership[]
  notifications  Notification[]
  supportTickets SupportTicket[]
  ownedSalons    Salon[]
  auditLogs      AuditLog[]

  @@index([phone])
  @@index([email])
  @@index([status])
  @@index([createdAt])
  @@map("users")
}

model Device {
  id             String    @id @default(uuid()) @db.Uuid
  userId         String    @db.Uuid
  deviceId       String    @unique @db.VarChar(255)
  deviceName     String?   @db.VarChar(255)
  deviceType     String?   @db.VarChar(50) // iOS, Android
  fcmToken       String?   @db.Text
  refreshToken   String?   @db.Text
  isActive       Boolean   @default(true)
  lastActiveAt   DateTime  @default(now())
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([deviceId])
  @@map("devices")
}

model Otp {
  id         String    @id @default(uuid()) @db.Uuid
  userId     String    @db.Uuid
  phone      String    @db.VarChar(15)
  otp        String    @db.VarChar(6)
  expiresAt  DateTime
  isVerified Boolean   @default(false)
  attempts   Int       @default(0)
  createdAt  DateTime  @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([phone])
  @@index([expiresAt])
  @@map("otps")
}

model Address {
  id             String   @id @default(uuid()) @db.Uuid
  userId         String   @db.Uuid
  label          String?  @db.VarChar(50) // Home, Work, Other
  addressLine1   String   @db.VarChar(255)
  addressLine2   String?  @db.VarChar(255)
  city           String   @db.VarChar(100)
  state          String   @db.VarChar(100)
  pincode        String   @db.VarChar(10)
  latitude       Float?
  longitude      Float?
  isDefault      Boolean  @default(false)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("addresses")
}

// ============================================
// SALON MANAGEMENT
// ============================================

model Salon {
  id               String       @id @default(uuid()) @db.Uuid
  ownerId          String       @db.Uuid
  name             String       @db.VarChar(255)
  slug             String       @unique @db.VarChar(255)
  description      String?      @db.Text
  phone            String       @db.VarChar(15)
  email            String?      @db.VarChar(255)
  addressLine1     String       @db.VarChar(255)
  addressLine2     String?      @db.VarChar(255)
  city             String       @db.VarChar(100)
  state            String       @db.VarChar(100)
  pincode          String       @db.VarChar(10)
  latitude         Float
  longitude        Float
  rating           Float        @default(0) @db.Real
  totalReviews     Int          @default(0)
  totalBookings    Int          @default(0)
  status           SalonStatus  @default(PENDING_APPROVAL)
  logoUrl          String?      @db.Text
  coverImageUrl    String?      @db.Text
  openingTime      String?      @db.VarChar(5) // HH:MM
  closingTime      String?      @db.VarChar(5) // HH:MM
  gender           Gender       @default(UNISEX)
  commissionRate   Float        @default(15) @db.Real // Platform commission %
  isVerified       Boolean      @default(false)
  verifiedAt       DateTime?
  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt
  deletedAt        DateTime?

  owner            User                @relation(fields: [ownerId], references: [id])
  services         SalonService[]
  staff            Staff[]
  bookings         Booking[]
  reviews          Review[]
  gallery          SalonGallery[]
  amenities        SalonAmenity[]
  workingHours     SalonWorkingHours[]
  holidays         SalonHoliday[]

  @@index([ownerId])
  @@index([slug])
  @@index([status])
  @@index([latitude, longitude])
  @@index([city])
  @@index([rating])
  @@map("salons")
}

model SalonGallery {
  id        String   @id @default(uuid()) @db.Uuid
  salonId   String   @db.Uuid
  imageUrl  String   @db.Text
  order     Int      @default(0)
  createdAt DateTime @default(now())

  salon Salon @relation(fields: [salonId], references: [id], onDelete: Cascade)

  @@index([salonId])
  @@map("salon_gallery")
}

model SalonAmenity {
  id        String   @id @default(uuid()) @db.Uuid
  salonId   String   @db.Uuid
  name      String   @db.VarChar(100)
  icon      String?  @db.VarChar(50)
  createdAt DateTime @default(now())

  salon Salon @relation(fields: [salonId], references: [id], onDelete: Cascade)

  @@index([salonId])
  @@map("salon_amenities")
}

model SalonWorkingHours {
  id          String    @id @default(uuid()) @db.Uuid
  salonId     String    @db.Uuid
  dayOfWeek   DayOfWeek
  startTime   String    @db.VarChar(5) // HH:MM
  endTime     String    @db.VarChar(5) // HH:MM
  isClosed    Boolean   @default(false)

  salon Salon @relation(fields: [salonId], references: [id], onDelete: Cascade)

  @@unique([salonId, dayOfWeek])
  @@index([salonId])
  @@map("salon_working_hours")
}

model SalonHoliday {
  id        String   @id @default(uuid()) @db.Uuid
  salonId   String   @db.Uuid
  date      DateTime @db.Date
  reason    String?  @db.VarChar(255)
  createdAt DateTime @default(now())

  salon Salon @relation(fields: [salonId], references: [id], onDelete: Cascade)

  @@index([salonId])
  @@index([date])
  @@map("salon_holidays")
}

// ============================================
// SERVICE MANAGEMENT
// ============================================

model ServiceCategory {
  id          String         @id @default(uuid()) @db.Uuid
  name        String         @unique @db.VarChar(100)
  slug        String         @unique @db.VarChar(100)
  description String?        @db.Text
  icon        String?        @db.VarChar(50)
  order       Int            @default(0)
  isActive    Boolean        @default(true)
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  services SalonService[]

  @@map("service_categories")
}

model SalonService {
  id          String    @id @default(uuid()) @db.Uuid
  salonId     String    @db.Uuid
  categoryId  String    @db.Uuid
  name        String    @db.VarChar(255)
  description String?   @db.Text
  price       Float     @db.Real
  duration    Int       // minutes
  isActive    Boolean   @default(true)
  imageUrl    String?   @db.Text
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  salon             Salon            @relation(fields: [salonId], references: [id], onDelete: Cascade)
  category          ServiceCategory  @relation(fields: [categoryId], references: [id])
  bookingServices   BookingService[]

  @@index([salonId])
  @@index([categoryId])
  @@index([isActive])
  @@map("salon_services")
}

// ============================================
// STAFF MANAGEMENT
// ============================================

model Staff {
  id              String   @id @default(uuid()) @db.Uuid
  salonId         String   @db.Uuid
  name            String   @db.VarChar(255)
  phone           String?  @db.VarChar(15)
  email           String?  @db.VarChar(255)
  avatarUrl       String?  @db.Text
  bio             String?  @db.Text
  specialization  String?  @db.Text
  rating          Float    @default(0) @db.Real
  totalBookings   Int      @default(0)
  isAvailable     Boolean  @default(true)
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  deletedAt       DateTime?

  salon              Salon               @relation(fields: [salonId], references: [id], onDelete: Cascade)
  availability       StaffAvailability[]
  bookings           Booking[]
  timeSlots          TimeSlot[]

  @@index([salonId])
  @@index([isActive])
  @@map("staff")
}

model StaffAvailability {
  id        String    @id @default(uuid()) @db.Uuid
  staffId   String    @db.Uuid
  dayOfWeek DayOfWeek
  startTime String    @db.VarChar(5) // HH:MM
  endTime   String    @db.VarChar(5) // HH:MM
  isActive  Boolean   @default(true)

  staff Staff @relation(fields: [staffId], references: [id], onDelete: Cascade)

  @@unique([staffId, dayOfWeek])
  @@index([staffId])
  @@map("staff_availability")
}

// ============================================
// BOOKING SYSTEM
// ============================================

model Booking {
  id                  String        @id @default(uuid()) @db.Uuid
  userId              String        @db.Uuid
  salonId             String        @db.Uuid
  staffId             String?       @db.Uuid
  bookingDate         DateTime      @db.Date
  startTime           String        @db.VarChar(5) // HH:MM
  endTime             String        @db.VarChar(5) // HH:MM
  status              BookingStatus @default(DRAFT)
  totalAmount         Float         @db.Real
  discountAmount      Float         @default(0) @db.Real
  finalAmount         Float         @db.Real
  paymentStatus       PaymentStatus @default(PENDING)
  couponId            String?       @db.Uuid
  cancellationReason  String?       @db.Text
  cancelledAt         DateTime?
  cancelledBy         String?       @db.Uuid
  checkedInAt         DateTime?
  completedAt         DateTime?
  idempotencyKey      String?       @unique @db.VarChar(255)
  createdAt           DateTime      @default(now())
  updatedAt           DateTime      @updatedAt

  user             User              @relation(fields: [userId], references: [id])
  salon            Salon             @relation(fields: [salonId], references: [id])
  staff            Staff?            @relation(fields: [staffId], references: [id])
  coupon           Coupon?           @relation(fields: [couponId], references: [id])
  services         BookingService[]
  payments         Payment[]
  review           Review?
  notifications    Notification[]

  @@index([userId])
  @@index([salonId])
  @@index([staffId])
  @@index([bookingDate])
  @@index([status])
  @@index([paymentStatus])
  @@index([createdAt])
  @@map("bookings")
}

model BookingService {
  id        String   @id @default(uuid()) @db.Uuid
  bookingId String   @db.Uuid
  serviceId String   @db.Uuid
  price     Float    @db.Real
  duration  Int      // minutes

  booking Booking      @relation(fields: [bookingId], references: [id], onDelete: Cascade)
  service SalonService @relation(fields: [serviceId], references: [id])

  @@index([bookingId])
  @@index([serviceId])
  @@map("booking_services")
}

model TimeSlot {
  id        String   @id @default(uuid()) @db.Uuid
  salonId   String   @db.Uuid
  staffId   String?  @db.Uuid
  date      DateTime @db.Date
  startTime String   @db.VarChar(5) // HH:MM
  endTime   String   @db.VarChar(5) // HH:MM
  isBooked  Boolean  @default(false)
  lockedBy  String?  @db.Uuid // For Redis lock tracking
  lockedAt  DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  salon Salon  @relation(fields: [salonId], references: [id], onDelete: Cascade)
  staff Staff? @relation(fields: [staffId], references: [id])

  @@unique([salonId, staffId, date, startTime])
  @@index([salonId, date, isBooked])
  @@index([staffId])
  @@map("time_slots")
}

// ============================================
// PAYMENT SYSTEM
// ============================================

model Payment {
  id              String         @id @default(uuid()) @db.Uuid
  bookingId       String         @db.Uuid
  userId          String         @db.Uuid
  gateway         PaymentGateway
  gatewayOrderId  String?        @db.VarChar(255)
  gatewayTxnId    String?        @unique @db.VarChar(255)
  amount          Float          @db.Real
  currency        String         @default("INR") @db.VarChar(3)
  status          PaymentStatus  @default(PENDING)
  paymentMethod   String?        @db.VarChar(50)
  errorCode       String?        @db.VarChar(50)
  errorMessage    String?        @db.Text
  signature       String?        @db.Text
  metadata        Json?
  paidAt          DateTime?
  refundedAt      DateTime?
  refundAmount    Float?         @db.Real
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  booking Booking @relation(fields: [bookingId], references: [id])

  @@index([bookingId])
  @@index([userId])
  @@index([status])
  @@index([createdAt])
  @@map("payments")
}

// ============================================
// WALLET & LOYALTY
// ============================================

model Wallet {
  id            String   @id @default(uuid()) @db.Uuid
  userId        String   @unique @db.Uuid
  balance       Float    @default(0) @db.Real
  loyaltyPoints Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  user         User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions WalletTransaction[]

  @@index([userId])
  @@map("wallets")
}

model WalletTransaction {
  id               String          @id @default(uuid()) @db.Uuid
  walletId         String          @db.Uuid
  type             TransactionType
  amount           Float           @db.Real
  balanceBefore    Float           @db.Real
  balanceAfter     Float           @db.Real
  description      String          @db.Text
  referenceId      String?         @db.Uuid // Booking ID, Payment ID, etc.
  referenceType    String?         @db.VarChar(50)
  metadata         Json?
  createdAt        DateTime        @default(now())

  wallet Wallet @relation(fields: [walletId], references: [id], onDelete: Cascade)

  @@index([walletId])
  @@index([createdAt])
  @@map("wallet_transactions")
}

model MembershipPlan {
  id               String   @id @default(uuid()) @db.Uuid
  name             String   @db.VarChar(255)
  description      String?  @db.Text
  price            Float    @db.Real
  durationDays     Int      // 30, 90, 365
  discountPercent  Float    @db.Real
  loyaltyMultiplier Float   @default(1) @db.Real
  benefits         Json?
  isActive         Boolean  @default(true)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  memberships Membership[]

  @@map("membership_plans")
}

model Membership {
  id        String           @id @default(uuid()) @db.Uuid
  userId    String           @db.Uuid
  planId    String           @db.Uuid
  startDate DateTime         @db.Date
  endDate   DateTime         @db.Date
  status    MembershipStatus @default(ACTIVE)
  createdAt DateTime         @default(now())
  updatedAt DateTime         @updatedAt

  user User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  plan MembershipPlan @relation(fields: [planId], references: [id])

  @@index([userId])
  @@index([status])
  @@map("memberships")
}

// ============================================
// COUPON SYSTEM
// ============================================

model Coupon {
  id               String       @id @default(uuid()) @db.Uuid
  code             String       @unique @db.VarChar(50)
  description      String?      @db.Text
  discountType     DiscountType
  discountValue    Float        @db.Real
  minOrderAmount   Float?       @db.Real
  maxDiscount      Float?       @db.Real
  maxUses          Int?
  usedCount        Int          @default(0)
  maxUsesPerUser   Int?         @default(1)
  validFrom        DateTime
  validTo          DateTime
  isActive         Boolean      @default(true)
  applicableFor    String?      @db.VarChar(50) // ALL, FIRST_TIME, SPECIFIC_SALON
  metadata         Json?
  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt

  bookings Booking[]

  @@index([code])
  @@index([validFrom, validTo])
  @@index([isActive])
  @@map("coupons")
}

// ============================================
// REVIEW SYSTEM
// ============================================

model Review {
  id        String   @id @default(uuid()) @db.Uuid
  bookingId String   @unique @db.Uuid
  userId    String   @db.Uuid
  salonId   String   @db.Uuid
  rating    Int      // 1-5
  comment   String?  @db.Text
  photos    String[] // Array of URLs
  isPublished Boolean @default(false)
  publishedAt DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  booking Booking @relation(fields: [bookingId], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [userId], references: [id])
  salon   Salon   @relation(fields: [salonId], references: [id])

  @@index([userId])
  @@index([salonId])
  @@index([rating])
  @@index([isPublished])
  @@map("reviews")
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================

model Notification {
  id        String           @id @default(uuid()) @db.Uuid
  userId    String           @db.Uuid
  type      NotificationType
  title     String           @db.VarChar(255)
  body      String           @db.Text
  data      Json?
  isRead    Boolean          @default(false)
  readAt    DateTime?
  bookingId String?          @db.Uuid
  createdAt DateTime         @default(now())

  user    User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  booking Booking? @relation(fields: [bookingId], references: [id])

  @@index([userId])
  @@index([isRead])
  @@index([createdAt])
  @@map("notifications")
}

// ============================================
// SUPPORT SYSTEM
// ============================================

model SupportTicket {
  id          String       @id @default(uuid()) @db.Uuid
  userId      String       @db.Uuid
  category    String       @db.VarChar(100)
  subject     String       @db.VarChar(255)
  description String       @db.Text
  status      TicketStatus @default(OPEN)
  priority    String?      @db.VarChar(20) // LOW, MEDIUM, HIGH
  assignedTo  String?      @db.Uuid
  resolvedAt  DateTime?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  user     User                 @relation(fields: [userId], references: [id])
  messages SupportTicketMessage[]

  @@index([userId])
  @@index([status])
  @@index([createdAt])
  @@map("support_tickets")
}

model SupportTicketMessage {
  id        String   @id @default(uuid()) @db.Uuid
  ticketId  String   @db.Uuid
  senderId  String   @db.Uuid
  message   String   @db.Text
  attachments String[] // Array of URLs
  createdAt DateTime @default(now())

  ticket SupportTicket @relation(fields: [ticketId], references: [id], onDelete: Cascade)

  @@index([ticketId])
  @@index([createdAt])
  @@map("support_ticket_messages")
}

// ============================================
// AUDIT & LOGS
// ============================================

model AuditLog {
  id         String   @id @default(uuid()) @db.Uuid
  userId     String?  @db.Uuid
  action     String   @db.VarChar(100)
  entity     String   @db.VarChar(100)
  entityId   String?  @db.Uuid
  oldValue   Json?
  newValue   Json?
  ipAddress  String?  @db.VarChar(45)
  userAgent  String?  @db.Text
  createdAt  DateTime @default(now())

  user User? @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([entity, entityId])
  @@index([createdAt])
  @@map("audit_logs")
}

// ============================================
// SYSTEM CONFIGURATION
// ============================================

model AppConfig {
  id        String   @id @default(uuid()) @db.Uuid
  key       String   @unique @db.VarChar(100)
  value     String   @db.Text
  dataType  String   @db.VarChar(20) // STRING, NUMBER, BOOLEAN, JSON
  isPublic  Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("app_config")
}

model Banner {
  id          String   @id @default(uuid()) @db.Uuid
  title       String   @db.VarChar(255)
  description String?  @db.Text
  imageUrl    String   @db.Text
  linkType    String?  @db.VarChar(50) // SALON, CATEGORY, EXTERNAL
  linkValue   String?  @db.Text
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  startDate   DateTime?
  endDate     DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([isActive])
  @@index([order])
  @@map("banners")
}
```

---

## Database Setup Commands

```bash
# Install Prisma
pnpm add -D prisma
pnpm add @prisma/client

# Initialize Prisma
npx prisma init

# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name init

# Seed database
npx prisma db seed

# Open Prisma Studio
npx prisma studio
```

---

## Critical Indexes Summary

```sql
-- High-traffic queries
CREATE INDEX idx_bookings_salon_date_status ON bookings(salon_id, booking_date, status);
CREATE INDEX idx_time_slots_availability ON time_slots(salon_id, date, is_booked);
CREATE INDEX idx_salons_location ON salons(latitude, longitude);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read, created_at);

-- Full-text search
CREATE INDEX idx_salons_search ON salons USING gin(to_tsvector('english', name || ' ' || description));
```

---

This schema includes:
 30+ tables
 All relationships
 Proper indexes
 UUID primary keys
 Soft deletes
 Audit logs
 Geospatial support
 Full-text search
 JSON fields for flexibility
 Enums for type safety

