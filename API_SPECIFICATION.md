#  COMPLETE REST API SPECIFICATION

**Base URL**: `https://api.salonapp.in/v1`

**Total APIs**: 120+

---

##  STANDARD RESPONSE FORMAT

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Validation failed",
    "details": [
      {
        "field": "phone",
        "message": "Invalid phone number"
      }
    ]
  }
}
```

---

##  AUTHENTICATION APIs

### 1. Send OTP
```http
POST /auth/send-otp
Content-Type: application/json

{
  "phone": "9876543210",
  "countryCode": "+91"
}

Response 200:
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "expiresIn": 600
  }
}
```

### 2. Verify OTP
```http
POST /auth/verify-otp
Content-Type: application/json

{
  "phone": "9876543210",
  "otp": "123456",
  "deviceId": "device-uuid"
}

Response 200:
{
  "success": true,
  "data": {
    "user": {...},
    "accessToken": "jwt-token",
    "refreshToken": "refresh-token",
    "expiresIn": 900
  }
}
```

### 3. Refresh Token
```http
POST /auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "refresh-token"
}
```

### 4. Logout
```http
POST /auth/logout
Authorization: Bearer {token}

{
  "deviceId": "device-uuid"
}
```

### 5. Social Login (Google)
```http
POST /auth/google
Content-Type: application/json

{
  "idToken": "google-id-token",
  "deviceId": "device-uuid"
}
```

---

##  USER APIs

### 6. Get Profile
```http
GET /users/me
Authorization: Bearer {token}
```

### 7. Update Profile
```http
PATCH /users/me
Authorization: Bearer {token}

{
  "name": "John Doe",
  "email": "john@example.com",
  "dateOfBirth": "1990-01-01",
  "gender": "MALE"
}
```

### 8. Upload Avatar
```http
POST /users/me/avatar
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [image file]
```

### 9. Delete Account
```http
DELETE /users/me
Authorization: Bearer {token}

{
  "reason": "Not using anymore"
}
```

---

##  ADDRESS APIs

### 10. List Addresses
```http
GET /users/me/addresses
Authorization: Bearer {token}
```

### 11. Add Address
```http
POST /users/me/addresses
Authorization: Bearer {token}

{
  "label": "Home",
  "addressLine1": "123 Main St",
  "city": "Ahmedabad",
  "state": "Gujarat",
  "pincode": "380001",
  "latitude": 23.0225,
  "longitude": 72.5714,
  "isDefault": true
}
```

### 12. Update Address
```http
PATCH /users/me/addresses/:id
Authorization: Bearer {token}
```

### 13. Delete Address
```http
DELETE /users/me/addresses/:id
Authorization: Bearer {token}
```

---

##  SALON APIs

### 14. Search Salons
```http
GET /salons/search
Authorization: Bearer {token}

Query Params:
- q: string (search query)
- latitude: number
- longitude: number
- radius: number (km)
- category: string
- gender: MALE|FEMALE|UNISEX
- rating: number
- priceRange: LOW|MEDIUM|HIGH
- sortBy: distance|rating|price
- page: number
- limit: number

Response 200:
{
  "success": true,
  "data": {
    "salons": [...],
    "meta": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "hasMore": true
    }
  }
}
```

### 15. Get Nearby Salons
```http
GET /salons/nearby
Authorization: Bearer {token}

Query Params:
- latitude: number (required)
- longitude: number (required)
- radius: number (default: 5km)
- limit: number
```

### 16. Get Salon Details
```http
GET /salons/:id
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Elite Salon",
    "rating": 4.5,
    "totalReviews": 230,
    "address": {...},
    "services": [...],
    "staff": [...],
    "gallery": [...],
    "amenities": [...],
    "workingHours": [...],
    "distance": 2.3
  }
}
```

### 17. Get Salon Services
```http
GET /salons/:id/services
Authorization: Bearer {token}

Query Params:
- categoryId: string
```

### 18. Get Salon Staff
```http
GET /salons/:id/staff
Authorization: Bearer {token}
```

### 19. Get Salon Reviews
```http
GET /salons/:id/reviews
Authorization: Bearer {token}

Query Params:
- page: number
- limit: number
- rating: number
```

---

##  BOOKING APIs

### 20. Get Available Slots
```http
GET /bookings/slots/available
Authorization: Bearer {token}

Query Params:
- salonId: string (required)
- staffId: string
- date: YYYY-MM-DD (required)
- serviceIds: string[] (comma-separated)

Response 200:
{
  "success": true,
  "data": {
    "slots": [
      {
        "startTime": "10:00",
        "endTime": "11:00",
        "isAvailable": true
      }
    ]
  }
}
```

### 21. Initiate Booking
```http
POST /bookings/initiate
Authorization: Bearer {token}

{
  "salonId": "uuid",
  "staffId": "uuid",
  "date": "2024-02-15",
  "startTime": "10:00",
  "serviceIds": ["uuid1", "uuid2"],
  "idempotencyKey": "unique-key"
}

Response 200:
{
  "success": true,
  "data": {
    "bookingId": "uuid",
    "totalAmount": 1500,
    "slotLockExpiry": "2024-02-15T10:05:00Z"
  }
}
```

### 22. Apply Coupon
```http
POST /bookings/:id/apply-coupon
Authorization: Bearer {token}

{
  "couponCode": "FIRST100"
}

Response 200:
{
  "success": true,
  "data": {
    "discount": 100,
    "finalAmount": 1400
  }
}
```

### 23. Create Payment Order
```http
POST /bookings/:id/payment/create-order
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": {
    "orderId": "razorpay-order-id",
    "amount": 1400,
    "currency": "INR",
    "key": "razorpay-key"
  }
}
```

### 24. Verify Payment
```http
POST /bookings/:id/payment/verify
Authorization: Bearer {token}

{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature"
}

Response 200:
{
  "success": true,
  "data": {
    "booking": {...},
    "status": "CONFIRMED"
  }
}
```

### 25. Get Booking History
```http
GET /bookings
Authorization: Bearer {token}

Query Params:
- status: UPCOMING|COMPLETED|CANCELLED
- page: number
- limit: number

Response 200:
{
  "success": true,
  "data": {
    "bookings": [...],
    "meta": {...}
  }
}
```

### 26. Get Booking Details
```http
GET /bookings/:id
Authorization: Bearer {token}
```

### 27. Cancel Booking
```http
POST /bookings/:id/cancel
Authorization: Bearer {token}

{
  "reason": "Emergency"
}
```

### 28. Reschedule Booking
```http
POST /bookings/:id/reschedule
Authorization: Bearer {token}

{
  "date": "2024-02-20",
  "startTime": "14:00"
}
```

---

##  WALLET APIs

### 29. Get Wallet Balance
```http
GET /wallet
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": {
    "balance": 1500,
    "loyaltyPoints": 250
  }
}
```

### 30. Add Money to Wallet
```http
POST /wallet/add-money
Authorization: Bearer {token}

{
  "amount": 1000
}

Response 200:
{
  "success": true,
  "data": {
    "orderId": "razorpay-order-id",
    "amount": 1000
  }
}
```

### 31. Get Transaction History
```http
GET /wallet/transactions
Authorization: Bearer {token}

Query Params:
- type: CREDIT|DEBIT|REFUND
- page: number
- limit: number
```

### 32. Get Loyalty Points History
```http
GET /wallet/loyalty-points
Authorization: Bearer {token}
```

---

##  MEMBERSHIP APIs

### 33. Get Membership Plans
```http
GET /memberships/plans
Authorization: Bearer {token}
```

### 34. Purchase Membership
```http
POST /memberships/purchase
Authorization: Bearer {token}

{
  "planId": "uuid"
}
```

### 35. Get Active Membership
```http
GET /memberships/active
Authorization: Bearer {token}
```

---

## ️ COUPON APIs

### 36. Get Available Coupons
```http
GET /coupons/available
Authorization: Bearer {token}

Query Params:
- amount: number
```

### 37. Validate Coupon
```http
POST /coupons/validate
Authorization: Bearer {token}

{
  "code": "FIRST100",
  "amount": 1500
}
```

---

##  REVIEW APIs

### 38. Submit Review
```http
POST /reviews
Authorization: Bearer {token}
Content-Type: multipart/form-data

bookingId: uuid
rating: 5
comment: "Great service!"
photos: [file1, file2]
```

### 39. Get My Reviews
```http
GET /reviews/me
Authorization: Bearer {token}
```

### 40. Update Review
```http
PATCH /reviews/:id
Authorization: Bearer {token}

{
  "rating": 4,
  "comment": "Updated comment"
}
```

### 41. Delete Review
```http
DELETE /reviews/:id
Authorization: Bearer {token}
```

---

##  NOTIFICATION APIs

### 42. Get Notifications
```http
GET /notifications
Authorization: Bearer {token}

Query Params:
- isRead: boolean
- page: number
- limit: number
```

### 43. Mark as Read
```http
PATCH /notifications/:id/read
Authorization: Bearer {token}
```

### 44. Mark All as Read
```http
POST /notifications/mark-all-read
Authorization: Bearer {token}
```

### 45. Update FCM Token
```http
POST /notifications/fcm-token
Authorization: Bearer {token}

{
  "token": "fcm-token"
}
```

---

##  SUPPORT APIs

### 46. Get FAQs
```http
GET /support/faqs
```

### 47. Create Ticket
```http
POST /support/tickets
Authorization: Bearer {token}

{
  "category": "Booking Issue",
  "subject": "Cannot cancel booking",
  "description": "Details..."
}
```

### 48. Get My Tickets
```http
GET /support/tickets
Authorization: Bearer {token}
```

### 49. Get Ticket Details
```http
GET /support/tickets/:id
Authorization: Bearer {token}
```

### 50. Add Ticket Message
```http
POST /support/tickets/:id/messages
Authorization: Bearer {token}

{
  "message": "Additional details"
}
```

---

##  SALON OWNER APIs

### 51. Register Salon
```http
POST /salon-owner/salons
Authorization: Bearer {token}

{
  "name": "Elite Salon",
  "phone": "9876543210",
  "addressLine1": "123 Main St",
  "city": "Ahmedabad",
  "state": "Gujarat",
  "pincode": "380001",
  "latitude": 23.0225,
  "longitude": 72.5714
}
```

### 52. Get My Salons
```http
GET /salon-owner/salons
Authorization: Bearer {token}
```

### 53. Update Salon
```http
PATCH /salon-owner/salons/:id
Authorization: Bearer {token}
```

### 54. Upload Salon Images
```http
POST /salon-owner/salons/:id/gallery
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

### 55. Get Salon Dashboard
```http
GET /salon-owner/salons/:id/dashboard
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": {
    "todayBookings": 12,
    "todayRevenue": 15000,
    "upcomingBookings": 8,
    "recentBookings": [...]
  }
}
```

### 56. Get Bookings
```http
GET /salon-owner/salons/:id/bookings
Authorization: Bearer {token}

Query Params:
- date: YYYY-MM-DD
- status: string
- page: number
```

### 57. Update Booking Status
```http
PATCH /salon-owner/bookings/:id/status
Authorization: Bearer {token}

{
  "status": "CHECKED_IN"
}
```

### 58. Create Manual Booking
```http
POST /salon-owner/salons/:id/bookings
Authorization: Bearer {token}

{
  "customerPhone": "9876543210",
  "serviceIds": ["uuid1"],
  "staffId": "uuid",
  "date": "2024-02-15",
  "startTime": "10:00"
}
```

### 59. Add Staff Member
```http
POST /salon-owner/salons/:id/staff
Authorization: Bearer {token}

{
  "name": "John Stylist",
  "phone": "9876543210",
  "specialization": "Hair cutting"
}
```

### 60. Update Staff
```http
PATCH /salon-owner/staff/:id
Authorization: Bearer {token}
```

### 61. Set Staff Availability
```http
POST /salon-owner/staff/:id/availability
Authorization: Bearer {token}

{
  "availability": [
    {
      "dayOfWeek": "MONDAY",
      "startTime": "10:00",
      "endTime": "19:00"
    }
  ]
}
```

### 62. Add Service
```http
POST /salon-owner/salons/:id/services
Authorization: Bearer {token}

{
  "categoryId": "uuid",
  "name": "Haircut",
  "price": 500,
  "duration": 30,
  "description": "Professional haircut"
}
```

### 63. Update Service
```http
PATCH /salon-owner/services/:id
Authorization: Bearer {token}
```

### 64. Delete Service
```http
DELETE /salon-owner/services/:id
Authorization: Bearer {token}
```

### 65. Get Revenue Report
```http
GET /salon-owner/salons/:id/reports/revenue
Authorization: Bearer {token}

Query Params:
- startDate: YYYY-MM-DD
- endDate: YYYY-MM-DD
- granularity: daily|weekly|monthly
```

### 66. Get Customer Report
```http
GET /salon-owner/salons/:id/reports/customers
Authorization: Bearer {token}
```

### 67. Get Service Performance
```http
GET /salon-owner/salons/:id/reports/services
Authorization: Bearer {token}
```

---

##  ADMIN APIs

### 68. Get All Users
```http
GET /admin/users
Authorization: Bearer {token}

Query Params:
- role: CUSTOMER|SALON_OWNER
- status: ACTIVE|SUSPENDED
- search: string
- page: number
```

### 69. Get User Details
```http
GET /admin/users/:id
Authorization: Bearer {token}
```

### 70. Update User Status
```http
PATCH /admin/users/:id/status
Authorization: Bearer {token}

{
  "status": "SUSPENDED",
  "reason": "Terms violation"
}
```

### 71. Get All Salons
```http
GET /admin/salons
Authorization: Bearer {token}

Query Params:
- status: PENDING_APPROVAL|ACTIVE|SUSPENDED
- search: string
- page: number
```

### 72. Approve Salon
```http
POST /admin/salons/:id/approve
Authorization: Bearer {token}
```

### 73. Reject Salon
```http
POST /admin/salons/:id/reject
Authorization: Bearer {token}

{
  "reason": "Incomplete documents"
}
```

### 74. Get All Bookings
```http
GET /admin/bookings
Authorization: Bearer {token}

Query Params:
- status: string
- startDate: YYYY-MM-DD
- endDate: YYYY-MM-DD
- salonId: string
- page: number
```

### 75. Get All Payments
```http
GET /admin/payments
Authorization: Bearer {token}

Query Params:
- status: string
- startDate: YYYY-MM-DD
- endDate: YYYY-MM-DD
- page: number
```

### 76. Process Refund
```http
POST /admin/payments/:id/refund
Authorization: Bearer {token}

{
  "amount": 1000,
  "reason": "Customer request"
}
```

### 77. Get Platform Analytics
```http
GET /admin/analytics/overview
Authorization: Bearer {token}

Query Params:
- startDate: YYYY-MM-DD
- endDate: YYYY-MM-DD
```

### 78. Get Support Tickets
```http
GET /admin/support/tickets
Authorization: Bearer {token}

Query Params:
- status: OPEN|IN_PROGRESS|RESOLVED
- priority: LOW|MEDIUM|HIGH
- page: number
```

### 79. Assign Ticket
```http
POST /admin/support/tickets/:id/assign
Authorization: Bearer {token}

{
  "assigneeId": "uuid"
}
```

### 80. Resolve Ticket
```http
POST /admin/support/tickets/:id/resolve
Authorization: Bearer {token}

{
  "resolution": "Issue resolved"
}
```

### 81. Create Banner
```http
POST /admin/banners
Authorization: Bearer {token}

{
  "title": "Summer Sale",
  "imageUrl": "url",
  "linkType": "CATEGORY",
  "linkValue": "uuid",
  "startDate": "2024-06-01",
  "endDate": "2024-06-30"
}
```

### 82. Update Banner
```http
PATCH /admin/banners/:id
Authorization: Bearer {token}
```

### 83. Create Coupon
```http
POST /admin/coupons
Authorization: Bearer {token}

{
  "code": "SUMMER50",
  "discountType": "PERCENTAGE",
  "discountValue": 50,
  "maxDiscount": 500,
  "maxUses": 100,
  "validFrom": "2024-06-01",
  "validTo": "2024-06-30"
}
```

### 84. Update Coupon
```http
PATCH /admin/coupons/:id
Authorization: Bearer {token}
```

### 85. Get Audit Logs
```http
GET /admin/audit-logs
Authorization: Bearer {token}

Query Params:
- userId: string
- action: string
- entity: string
- startDate: YYYY-MM-DD
- endDate: YYYY-MM-DD
- page: number
```

---

##  SEARCH APIs

### 86. Global Search
```http
GET /search
Authorization: Bearer {token}

Query Params:
- q: string (required)
- type: salon|service|category
- page: number
```

### 87. Get Search Suggestions
```http
GET /search/suggestions
Authorization: Bearer {token}

Query Params:
- q: string (required)
- limit: number
```

---

##  ANALYTICS APIs (SALON OWNER)

### 88. Get Overview Stats
```http
GET /salon-owner/salons/:id/analytics/overview
Authorization: Bearer {token}

Query Params:
- period: today|week|month|year
```

### 89. Get Booking Trends
```http
GET /salon-owner/salons/:id/analytics/booking-trends
Authorization: Bearer {token}

Query Params:
- startDate: YYYY-MM-DD
- endDate: YYYY-MM-DD
```

### 90. Get Revenue Trends
```http
GET /salon-owner/salons/:id/analytics/revenue-trends
Authorization: Bearer {token}

Query Params:
- startDate: YYYY-MM-DD
- endDate: YYYY-MM-DD
```

---

##  PUBLIC APIs (No Auth Required)

### 91. Get Service Categories
```http
GET /categories
```

### 92. Get Cities
```http
GET /cities
```

### 93. Get App Config
```http
GET /config
```

### 94. Get Banners
```http
GET /banners
```

### 95. Health Check
```http
GET /health

Response 200:
{
  "status": "healthy",
  "timestamp": "2024-02-15T10:00:00Z",
  "services": {
    "database": "up",
    "redis": "up",
    "storage": "up"
  }
}
```

---

##  DEVICE APIs

### 96. Register Device
```http
POST /devices/register
Authorization: Bearer {token}

{
  "deviceId": "unique-device-id",
  "deviceName": "iPhone 14",
  "deviceType": "iOS",
  "fcmToken": "fcm-token"
}
```

### 97. Unregister Device
```http
DELETE /devices/:deviceId
Authorization: Bearer {token}
```

---

##  REFERRAL APIs

### 98. Get Referral Code
```http
GET /referrals/my-code
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": {
    "code": "JOHN1234",
    "referrals": 5,
    "earnings": 500
  }
}
```

### 99. Apply Referral Code
```http
POST /referrals/apply
Authorization: Bearer {token}

{
  "code": "JOHN1234"
}
```

---

##  UPLOAD APIs

### 100. Upload Image
```http
POST /upload/image
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [image file]
type: avatar|gallery|review

Response 200:
{
  "success": true,
  "data": {
    "url": "https://cdn.salonapp.in/images/uuid.jpg"
  }
}
```

---

## RATE LIMITS

- **Authentication**: 5 requests per 15 minutes per IP
- **Standard APIs**: 100 requests per minute per user
- **Search APIs**: 30 requests per minute per user
- **Upload APIs**: 10 requests per minute per user

---

## ERROR CODES

| Code | Message | HTTP Status |
|------|---------|-------------|
| AUTH_001 | Invalid credentials | 401 |
| AUTH_002 | Token expired | 401 |
| AUTH_003 | Invalid OTP | 400 |
| AUTH_004 | OTP expired | 400 |
| VAL_001 | Validation failed | 400 |
| BOOK_001 | Slot not available | 409 |
| BOOK_002 | Booking not found | 404 |
| PAY_001 | Payment failed | 400 |
| PAY_002 | Invalid signature | 400 |
| RATE_001 | Rate limit exceeded | 429 |
| SYS_001 | Internal server error | 500 |

---

This API specification provides the complete backend interface for the Salon Booking Platform with proper REST conventions, error handling, and security measures.

