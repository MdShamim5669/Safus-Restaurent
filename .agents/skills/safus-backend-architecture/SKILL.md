---
name: safus-backend-architecture
description: Comprehensive technical reference and guidelines for building and extending the SaFus Restaurant Express+TypeScript+Prisma backend.
---

# SaFus Restaurant Backend Architecture & Standards

This skill serves as the primary technical blueprint and architectural specification for the **SaFus Restaurant Backend** (`server/`).

---

## 🧱 Tech Stack Overview

- **Core Framework**: Node.js, Express.js, TypeScript
- **ORM & Database**: Prisma ORM, PostgreSQL (hosted on Neon)
- **Authentication**: JWT (Access Token + Refresh Token in httpOnly Cookie), bcrypt
- **Validation**: Zod payload and parameter validation
- **Third-Party Integrations**:
  - **Cloudinary**: Media uploads (Menu images/videos, user avatars) targeting the `'safus-restaurant'` folder. *Only CDN HTTPS URLs stored in DB*.
  - **Stripe / SSLCommerz**: Payment processing & webhook/IPN verification
  - **Resend**: Transactional emails & OTP verification code delivery

---

## 📂 Modular Folder Structure (`server/`)

Code MUST follow the modular feature pattern in `server/module/<feature>/`:

```
server/
├── config/                  # DB, Cloudinary, Resend, env configs
├── prisma/                  # schema/ (multi-file Prisma models) & migrations
├── module/
│   ├── auth/                # register, login, OTP, token refresh, password reset
│   ├── user/                # profile management, admin user role management
│   ├── menu/                # CRUD menu items + Cloudinary uploads
│   ├── cart/                # cart item management
│   ├── order/               # order creation, status transitions, history
│   ├── reservation/          # table bookings
│   ├── review/              # customer ratings & reviews
│   ├── payment/             # Stripe & SSLCommerz integrations & webhooks
│   ├── otp/                 # OTP creation, expiry, verification
│   ├── middleware/          # authMiddleware, validateRequest, globalErrorHandler, notFoundMiddleware
│   ├── routes/              # central router mounting all feature routes
│   ├── shared/              # shared interfaces, types, enums
│   └── utils/               # jwtHelpers, sendResponse, catchAsync, generateOtp
├── app.ts                   # Express app configuration
└── server.ts                # Server bootstrapper & DB connection
```

---

## 🔁 Module Pattern Rules

Every module in `server/module/<feature>/` strictly implements 4 layers:

1. **`feature.route.ts`**:
   - Defines express routes.
   - Mounts `authMiddleware` or `roleGuard('ADMIN')` where required.
   - Mounts `validateRequest(zodSchema)` on mutating endpoints.
2. **`feature.controller.ts`**:
   - Thin functions using `catchAsync`.
   - Delegates business logic to services.
   - Standardizes response via `sendResponse(res, { statusCode, success, message, data })`.
3. **`feature.service.ts`**:
   - Contains all business logic and Prisma ORM database queries.
   - Handles transactions (`prisma.$transaction`) for interdependent operations.
4. **`feature.validation.ts`**:
   - Defines Zod schemas (`z.object({...})`) for request validation.

---

## 🗄️ Prisma Data Models & Enums

### Enums
- **Role**: `ADMIN`, `CUSTOMER`
- **OrderStatus**: `PENDING`, `PAID`, `PREPARING`, `DELIVERED`, `CANCELLED`
- **PaymentGateway**: `STRIPE`, `SSLCOMMERZ`
- **PaymentStatus**: `PENDING`, `SUCCESS`, `FAILED`

### Models Overview
- `User` 1—N `Order`, `Reservation`, `Review`, `CartItem`, `Otp`
- `Order` 1—1 `Payment`
- `Order` 1—N `OrderItem`
- `Menu` 1—N `CartItem`, `OrderItem`

---

## 🔐 Auth & Payment Flows

### 1. Registration & OTP Flow
- User registers $\rightarrow$ `User` created (`isVerified = false`).
- 6-digit OTP generated in `Otp` table, emailed via Resend.
- OTP verification matches active non-expired code $\rightarrow$ updates `User.isVerified = true` and issues JWT access token + refresh token cookie.

### 2. Order & Payment Atomic Flow
- Checkout initiates `Order` (`PENDING`) and `Payment` (`PENDING`).
- Gateway webhook (Stripe) or IPN (SSLCommerz) validates signature.
- Atomic Prisma transaction updates `Payment.status = SUCCESS` and `Order.status = PAID`.

---

## 🗺️ Implementation Roadmap

1. **Phase 1**: Database & Environment (Neon Postgres migration + seeding)
2. **Phase 2**: Auth Module (OTP, JWT, Refresh Token, Password Reset)
3. **Phase 3**: Core Modules (Menu, Cart, Order, Reservation, Review, User)
4. **Phase 4**: Payment Integrations (Stripe webhook & SSLCommerz IPN)
5. **Phase 5**: Hardening & Ops (Rate limiting, Helmet, Pino logging, Jest/Supertest)
