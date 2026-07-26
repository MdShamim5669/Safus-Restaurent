---
name: safus-frontend-architecture
description: Architecture standards, guidelines, directory structure, TanStack Query v5 + Axios data fetching patterns, Firebase Auth integration, and UI rules for SaFus Restaurant Frontend.
---

# 🎨 SaFus Restaurant Frontend Architecture Guidelines

## 🛠️ Technology Stack
- **Framework**: React 18+ (Vite) + TypeScript
- **Authentication**: **Firebase Authentication** (Google Social Login & Email/Password) integrated with Backend JWT issuance.
- **State & Data Fetching**: **TanStack Query v5** (React Query) + **Axios** (with interceptors for backend JWT tokens & error handling)
- **Styling & UI**: TailwindCSS + DaisyUI + Lucide-React Icons + Framer Motion
- **Form Management**: React Hook Form + Zod
- **Routing**: React Router v6 (BrowserRouter, PrivateRoute, AdminRoute)
- **Toasts & Feedback**: Sonner / React Hot Toast
- **Payment Elements**: `@stripe/react-stripe-js` + `@stripe/stripe-js`

---

## 📁 Directory Structure Standard (`client/src/`)

```text
client/src/
├── api/                   # Axios instance & custom hooks with TanStack Query
│   ├── axiosInstance.ts   # Configured Axios instance with live Render base URL & interceptors
│   ├── useAuth.ts         # Authentication mutations (Firebase login/register & JWT sync)
│   ├── useMenu.ts         # Menu queries & admin mutations
│   ├── useCart.ts         # Cart queries & mutations
│   ├── useOrders.ts       # Order queries & admin status updates
│   ├── useReservations.ts # Table booking queries & mutations
│   └── useReviews.ts      # Rating & feedback queries & mutations
├── config/                # Third-party configurations
│   └── firebase.config.ts # Firebase SDK initialization (Auth, GoogleAuthProvider)
├── assets/                # Statics, images, logos
├── components/            # Reusable UI components
│   ├── common/            # Navbar, Footer, LoadingSpinner, SectionTitle, Modal
│   ├── ui/                # Button, Input, Card, Badge, Drawer
│   └── food/              # FoodCard, CategoryTabs, MenuGrid
├── context/               # AuthContext for Firebase User & JWT token provider
│   └── AuthContext.tsx
├── pages/                 # Top-level Page Views
│   ├── Home/              # Hero, Featured Menu, Special Offers, Testimonials
│   ├── Menu/              # Full Menu listing with Category tabs & Search filter
│   ├── Cart/              # Cart item management & running summary
│   ├── Checkout/          # Address form & Stripe/SSLCommerz Payment UI
│   ├── Reservation/       # Table Booking Form
│   ├── Login/             # User Login (Email/Password & Google Sign-In)
│   ├── Register/          # User Registration & OTP Modal
│   └── Dashboard/         # Dashboard layout
│       ├── Customer/      # My Orders, My Reservations, Profile Settings
│       └── Admin/         # Manage Menu, All Orders, Manage Users, All Reservations
├── routes/                # Application Routes
│   ├── index.tsx          # Router configuration
│   ├── PrivateRoute.tsx   # Authenticated route guard
│   └── AdminRoute.tsx     # Admin-only route guard
├── types/                 # Centralized TypeScript interface definitions
├── utils/                 # Currency formatters, date formatters, toast helpers
└── App.tsx
```

---

## 🔌 TanStack Query + Axios + Firebase Pattern Standards

### 1. Firebase Auth + Backend Sync (`context/AuthContext.tsx`)
- Initialize Firebase Auth app with `signInWithPopup(auth, googleProvider)` for Google Login.
- Upon successful Firebase login, send user details to backend API to generate custom JWT tokens and create/sync user record in PostgreSQL.

### 2. Axios Instance Setup (`api/axiosInstance.ts`)
- Base URL: `https://safus-restaurent.onrender.com/api/v1`
- `withCredentials: true` enabled for HTTP-only cookies.
- Interceptor automatically attaches `Authorization: Bearer <accessToken>`.

### 3. Query Keys & Invalidation
- Query keys structured as `['menu', category, search]`, `['cart']`, `['orders']`.
- Mutators call `queryClient.invalidateQueries({ queryKey: [...] })` inside `onSuccess` handlers for instant UI synchronization.

---

## 🎨 UI & Aesthetic Rules
- **Vibrant & Modern Aesthetic**: Curated dark/light color palettes, smooth hover states, glassmorphism, and Framer Motion micro-animations.
- **Responsive Layout**: Mobile-first responsive grids and flex layouts via TailwindCSS and DaisyUI.
