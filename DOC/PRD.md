# PRD — SaFus Restaurant

## 1. Overview
SaFus Restaurant is a restaurant management platform enabling customers to browse menus, reserve tables, order food, pay online, and leave reviews — while restaurant staff/admins manage menus, orders, reservations, and users from a dashboard.

## 2. Goals
- Let customers self-serve: browse, order, pay, reserve, review
- Give admins full control over menu, orders, reservations, and staff/users
- Provide secure auth (JWT + OTP verification) and reliable payments (Stripe/SSLCommerz)
- Store media (menu images/videos) reliably via Cloudinary

## 3. User Roles
| Role | Permissions |
|---|---|
| Guest | Browse menu, view reviews, register/login |
| Customer | Cart, checkout, book reservation, review, view own orders |
| Admin | Full CRUD on menu, users, orders, reservations; view analytics |

## 4. Core Features & User Stories

### Authentication
- As a user, I can register with email/password and verify via OTP before my account is active.
- As a user, I can reset my password via an emailed reset link (Resend).
- As a user, I stay logged in via JWT access + refresh tokens.

### Menu
- As a customer, I can browse menu items by category (salad, pizza, soup, dessert, drinks…).
- As an admin, I can add/update/delete menu items, including uploading images/video (Cloudinary).

### Cart & Checkout
- As a customer, I can add/remove items from my cart and see a running total.
- As a customer, I can pay via Stripe or SSLCommerz at checkout.

### Reservation
- As a customer, I can book a table for a date/time/party size.
- As an admin, I can view/manage/cancel reservations.

### Reviews
- As a customer, I can leave a rating + comment on the restaurant/menu item.

### Dashboard
- As an admin, I see key metrics: total orders, revenue, top menu items, upcoming reservations.
- As an admin, I can manage staff/user roles.

## 5. Non-Functional Requirements
- Input validation via Zod on both client and server
- Secure CORS policy, rate-limited auth endpoints
- Responsive UI (mobile-first)
- All secrets in `.env`, never committed

## 6. Out of Scope (v1)
- Multi-restaurant/multi-branch support
- Native mobile apps
- Delivery/rider tracking

## 7. Success Metrics
- Checkout conversion rate
- Reservation completion rate
- Admin task completion time (menu/order updates)
