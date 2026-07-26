# Architecture — SaFus

## High-Level Overview

```
┌─────────────┐        HTTPS/JSON        ┌──────────────┐        Prisma        ┌──────────────┐
│   React     │ ───────────────────────▶ │   Express     │ ───────────────────▶ │  PostgreSQL   │
│  (Vite SPA) │ ◀─────────────────────── │  (TypeScript) │ ◀─────────────────── │   (NeonDB)    │
└─────────────┘                          └──────────────┘                      └──────────────┘
      │                                          │
      │ Cloudinary widget/upload                 │ Cloudinary Admin API
      ▼                                          ▼
┌─────────────┐                          ┌──────────────┐
│ Cloudinary  │                          │  Stripe /    │
│ (media CDN) │                          │  SSLCommerz  │
└─────────────┘                          └──────────────┘
                                                 │
                                                 ▼
                                          ┌──────────────┐
                                          │   Resend     │
                                          │ (OTP/email)  │
                                          └──────────────┘
```

## Layers

1. **Client (React SPA)** — pages/components consume a typed `services/` API layer built on Axios; `AuthContext` holds the logged-in user + JWT; route guards (`PrivateRoute`, `AdminRoute`) gate access by role.
2. **API (Express + TypeScript)** — modular, feature-based (`module/<feature>`), each with route → controller → service → validation. Global middlewares: CORS, JSON body parsing, `authMiddleware`, `globalErrorHandler`.
3. **Data (PostgreSQL via Prisma, hosted on Neon)** — single source of truth; Prisma Client generated from `schema.prisma`, migrations tracked in `prisma/migrations`.
4. **Third-party services**
   - **Cloudinary** — menu image/video storage & delivery (CDN URLs only in DB)
   - **Stripe / SSLCommerz** — payment processing; webhooks/IPN update `Payment` + `Order` status
   - **Resend** — transactional email for OTP verification & password reset

## Auth Flow
1. Register → user created (`isVerified = false`) → OTP generated & emailed via Resend.
2. VerifyOtp → matches code + not expired → `isVerified = true` → JWT access + refresh issued.
3. Subsequent requests send `Authorization: Bearer <accessToken>`; `authMiddleware` verifies and attaches `req.user`.
4. Refresh token (httpOnly cookie) used to silently reissue access tokens.

## Order/Payment Flow
1. Customer builds cart → checkout → chooses Stripe or SSLCommerz.
2. Backend creates `Order` (PENDING) + `Payment` (PENDING) → initiates gateway session.
3. Gateway webhook/IPN confirms payment → `Payment.status = SUCCESS`, `Order.status = PAID`.
4. Admin dashboard updates order through `PREPARING → DELIVERED`.

## Deployment Notes
- Frontend: static build (Vite) deployable to Vercel/Netlify/Firebase Hosting.
- Backend: Node server deployable to Railway/Render/Vercel serverless functions.
- Use Neon's pooled `DATABASE_URL` (with `-pooler` connection string) for serverless backend deployments.
