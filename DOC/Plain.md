# Backend Plan — SaFus Restaurant (server/)

Overall roadmap for building out the Express + TypeScript + Prisma + PostgreSQL (Neon) backend from the current scaffolding into a production-ready API.

## Phase 0 — Foundation (done in scaffolding)
- [x] Folder structure (`config/`, `module/<feature>`, `prisma/`)
- [x] Prisma schema: User, Otp, Menu, CartItem, Order, OrderItem, Payment, Reservation, Review
- [x] Global middleware: `authMiddleware`, `validateRequest` (Zod), `globalErrorHandler`, `notFoundMiddleware`
- [x] `app.ts` / `server.ts` wiring, central router

## Phase 1 — Database & Environment
1. Create Neon project → get connection string `DATABASE_URL`
2. Run `npx prisma migrate dev --name init` against Neon
3. Seed script (`prisma/seed.ts`) importing `menu.json` / `reviews.json` from the original resources
4. Fill `.env` from `.env.example` (JWT secrets, Cloudinary, Stripe, SSLCommerz, Resend keys)

## Phase 2 — Auth Module (core, do first)
1. Finish register → OTP (Resend) → verify → JWT issue flow (already stubbed)
2. Add refresh-token endpoint (`/auth/refresh`) reading httpOnly cookie
3. Add forgot-password / reset-password endpoints + Resend email template
4. Add rate limiting on `/auth/*` (e.g. `express-rate-limit`) to prevent OTP abuse

## Phase 3 — Core Feature Modules
1. **Menu** — wire Cloudinary upload (multer + `cloudinary.uploader.upload_stream`) into create/update
2. **Cart** — quantity update endpoint, clear-cart-on-checkout
3. **Order** — finalize order creation from cart, status transition rules (admin-only)
4. **Reservation** — conflict/capacity check (optional v1.1)
5. **Review** — restrict to users who've completed an order (optional v1.1)
6. **User** — admin role management, profile update with Cloudinary avatar upload

## Phase 4 — Payments
1. Stripe: implement webhook signature verification (`stripe.webhooks.constructEvent`), update `Payment`/`Order` on `payment_intent.succeeded`/`failed`
2. SSLCommerz: complete `init_transaction`, IPN validation, success/fail/cancel redirect routes
3. Ensure `Order.status` and `Payment.status` update atomically (Prisma transaction)

## Phase 5 — Hardening & Ops
1. Centralize logging (e.g. `pino` or `morgan`)
2. Add request rate limiting + Helmet for security headers
3. Add integration tests per module (Jest + Supertest)
4. Add Swagger/OpenAPI doc generation for the API
5. CI: lint + typecheck + test on push; deploy to Railway/Render

## Suggested Order of Work
Auth → Menu → Cart → Order → Payment → Reservation → Review → Admin dashboard endpoints → Hardening