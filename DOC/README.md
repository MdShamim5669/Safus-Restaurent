# 🍳 SaFus Restaurant — Restaurant Management Platform

SaFus Restaurant is a full-featured restaurant management web application. It lets customers browse the menu, book reservations, order food online and pay securely, while giving staff and admins a dashboard to manage menus, orders, reservations, and users.

## ✨ Features

- **Authentication** — Email/password + JWT, OTP-verified signup, password reset via Resend email
- **Menu Management** — Browse by category, admin CRUD for menu items with Cloudinary image/video upload
- **Cart & Checkout** — Add to cart, Stripe/SSLCommerz payment integration
- **Reservations** — Book, view, cancel table reservations
- **Reviews** — Customers can leave ratings/reviews
- **Role-based Dashboard** — Admin, Staff, and Customer views with different permissions
- **Order Tracking** — Real-time order status updates

## 🧱 Tech Stack

### Backend
Node.js, Express, TypeScript, Prisma ORM, PostgreSQL (hosted on Neon), JWT, Zod, CORS, Stripe, SSLCommerz, Cloudinary, Resend (email/OTP)

### Frontend
React (Vite), TypeScript, Tailwind + DaisyUI + shadcn/ui, Zod, React Hook Form, react-icons, Framer Motion, Spline (3D), Stripe Elements / SSLCommerz checkout, Axios

## 📂 Project Structure

See `instructionForFrontend.md` and `instructionForBackend.md` for full folder breakdowns.

## 🚀 Getting Started

```bash
# Backend
cd server
npm install
npx prisma generate
npx prisma migrate dev
npm run dev

# Frontend
cd client
npm install
npm run dev
```

## 🔑 Environment Variables

See `.env.example` in each app (documented in `instructionForFrontend.md` / `instructionForBackend.md`).

## 📚 Related Docs

- `PRD.md` — Product requirements & user stories
- `ARCHITECTURE.md` — System architecture & data flow
- `DatabaseDesign.md` — Prisma schema & ER design
- `CHANGELOG.md` — Version history

## 📄 License

MIT
