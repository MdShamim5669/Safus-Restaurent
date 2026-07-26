# Backend Instructions — SaFus Restaurant (server/)

## Tech Stack
Node.js + Express + TypeScript, Prisma ORM, PostgreSQL (Neon), JWT (access + refresh), Zod, CORS, Stripe + SSLCommerz, Cloudinary (image/video upload), Resend (email/OTP).

## Folder Structure

```
server/
├── config/
│   ├── db.ts                     # Prisma client singleton
│   ├── cloudinary.ts        # Cloudinary SDK config
│   ├── resend.ts              # Resend email client config
│   └── env.ts                    # zod-validated environment variables
├── prisma/
│   ├── schema.prisma       # models: User, Menu, Cart, Order, Reservation, Review, Payment, Otp
│   └── migrations/
├── module/
│   ├── auth/
│   │   ├── auth.controller.ts     # register, login, verifyOtp, refreshToken, forgotPassword, resetPassword
│   │   ├── auth.route.ts
│   │   ├── auth.service.ts
│   │   └── auth.validation.ts       # zod schemas
│   ├── user/                              # profile, role management (admin-only)
│   ├── menu/                             # CRUD + Cloudinary image/video upload
│   ├── cart/                                # add/remove/list cart items
│   ├── order/                              # create order, status update, history
│   ├── reservation/                   # create/list/cancel table bookings
│   ├── review/                           # create/list reviews
│   ├── payment/
│   │   ├── stripe.controller.ts
│   │   ├── sslcommerz.controller.ts
│   │   └── payment.route.ts
│   ├── otp/                                 # generate/verify OTP, expiry logic
│   ├── middleware/
│   │   ├── authMiddleware.ts          # JWT verification & role guard
│   │   ├── validateRequest.ts          # zod middleware
│   │   ├── globalErrorHandler.ts
│   │   └── notFoundMiddleware.ts
│   ├── routes/                             # central router aggregating all module routes
│   ├── shared/                             # shared TS interfaces/types/enums (Role, OrderStatus…)
│   └── utils/
│       ├── jwtHelpers.ts
│       ├── sendResponse.ts
│       ├── catchAsync.ts
│       └── generateOtp.ts
├── app.ts                                     # express app, cors, json, route mounting
├── server.ts                                # entry point — connects DB, starts listener
├── tsconfig.json
├── .env
└── package.json
```

## Setup

```bash
npm init -y
npm install express cors dotenv jsonwebtoken bcrypt zod
npm install @prisma/client cloudinary resend stripe sslcommerz-lts
npm install -D typescript ts-node-dev prisma @types/express @types/jsonwebtoken @types/cors
npx prisma init --datasource-provider postgresql
```

## Conventions
- Layered pattern per module: **route → controller → service → validation**. Controllers stay thin (only req/res + status codes); business logic and Prisma queries live in services.
- Every mutating route runs through `validateRequest(zodSchema)` before the controller.
- `authMiddleware` checks JWT and attaches `req.user`; a `roleGuard('admin')` wrapper restricts admin-only routes.
- Passwords hashed with bcrypt; JWT access token short-lived, refresh token httpOnly cookie.
- OTP: 6-digit code stored with expiry (5–10 min) in `Otp` table, emailed via Resend; verified before `User.isVerified = true`.
- Payments: `payment` module exposes `/payment/stripe/intent` and `/payment/sslcommerz/init`; both write a `Payment` record linked to `Order` on success (webhook/IPN for Stripe & SSLCommerz respectively).
- Media uploads (menu images/videos) go straight to Cloudinary from the `menu` module; only the returned URL is stored in Postgres.

## Environment Variables (`.env`)
```
PORT=
DATABASE_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
STRIPE_SECRET_KEY=
SSLCZ_STORE_ID=
SSLCZ_STORE_PASSWORD=
RESEND_API_KEY=
CLIENT_URL=
```
