# 🍳 SaFus Restaurant Backend API

A high-performance, modular, and scalable RESTful API built for the **SaFus Restaurant Management Platform**.

![NodeJS](https://img.shields.io/badge/Node.js-v20.x-green?style=flat&logo=nodedotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.3-blue?style=flat&logo=typescript)
![Express](https://img.shields.io/badge/Express-v4.18-lightgrey?style=flat&logo=express)
![Prisma](https://img.shields.io/badge/Prisma-v5.22-black?style=flat&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Cloud-blue?style=flat&logo=postgresql)
![Status](https://img.shields.io/badge/Status-Live_Online-brightgreen)

---

## 🌐 Live Server & Deployment Links

| Environment | URL | Status |
| :--- | :--- | :--- |
| **Live Production Base URL** | `https://safus-restaurent.onrender.com` | ![Online](https://img.shields.io/badge/Server-Active-brightgreen) |
| **API Root Endpoint** | `https://safus-restaurent.onrender.com/api/v1` | ![API](https://img.shields.io/badge/API-v1-blue) |
| **Database** | Neon PostgreSQL Cloud Database | ![DB](https://img.shields.io/badge/NeonDB-Connected-success) |

---

## 🚀 Live API Endpoints Map (Testing Reference)

Below is the complete reference map for testing live endpoints online or via Postman:

| Endpoint Path | Method | Access Level | Description | Live Test Status |
| :--- | :---: | :---: | :--- | :---: |
| `/` | `GET` | **Public** | Server Health Check | `200 OK` 🟢 |
| `/api/v1/menu` | `GET` | **Public** | Browse all menu items (Filter & Search) | `200 OK` 🟢 |
| `/api/v1/menu` | `POST` | **Admin** | Create new menu item | `201 Created` 🟢 |
| `/api/v1/auth/register` | `POST` | **Public** | User registration (Triggers OTP) | `201 Created` 🟢 |
| `/api/v1/auth/verify-otp` | `POST` | **Public** | Verify email OTP & receive tokens | `200 OK` 🟢 |
| `/api/v1/auth/login` | `POST` | **Public** | Account authentication (Sets HTTP-Only Cookies) | `200 OK` 🟢 |
| `/api/v1/cart` | `GET` | **User/Admin** | Retrieve logged-in user's cart | `200 OK` 🟢 |
| `/api/v1/cart` | `POST` | **User/Admin** | Add item to cart | `201 Created` 🟢 |
| `/api/v1/orders` | `POST` | **User/Admin** | Create order & clear cart atomically | `201 Created` 🟢 |
| `/api/v1/orders/my-orders` | `GET` | **User/Admin** | Fetch logged-in user's order history | `200 OK` 🟢 |
| `/api/v1/orders/all-orders` | `GET` | **Admin** | View all customer platform orders | `200 OK` 🟢 |
| `/api/v1/orders/:id/status` | `PATCH` | **Admin** | Update order status (`PENDING -> DELIVERED`) | `200 OK` 🟢 |
| `/api/v1/reservations` | `POST` | **User/Admin** | Book a restaurant table reservation | `201 Created` 🟢 |
| `/api/v1/reviews` | `GET` | **Public** | Public customer ratings & reviews | `200 OK` 🟢 |
| `/api/v1/reviews` | `POST` | **User/Admin** | Post customer rating & feedback | `201 Created` 🟢 |

---

## 🛡️ Default Master Admin Credentials (Testing)

For testing Admin endpoints (`POST /menu`, `PATCH /orders/:id/status`, `GET /users`, etc.), use the following seeded account:

- **Email**: `admin@safus.com`
- **Password**: `admin123456`
- **Role**: `ADMIN`

---

## 💻 Tech Stack & Architecture Highlights

- **Modular Architecture**: Clean separation between Routes, Controllers, Services, and Zod Validations under `module/<feature>/`.
- **Prisma Multi-File Schemas**: Scalable database schema structure located in `prisma/schema/`.
- **Database Transactions**: Atomic updates across `Order` creation, `Payment` gateway callbacks, and `CartItem` deletion using `prisma.$transaction`.
- **Security**: JWT Access/Refresh tokens stored in `httpOnly` secure cookies and Bearer headers.
- **Third-Party Integrations**:
  - **Cloudinary**: Image upload management targeting the `'safus-restaurant'` folder.
  - **Resend API**: Automated 6-digit OTP email delivery.
  - **Stripe & SSLCommerz**: Payment gateway integration.

---

## 🛠️ Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/MdShamim5669/Safus-Restaurent.git
   cd Safus-Restaurent
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL="your_postgresql_connection_string"
   JWT_ACCESS_SECRET="your_access_secret"
   JWT_REFRESH_SECRET="your_refresh_secret"
   CLOUDINARY_CLOUD_NAME="your_cloud_name"
   CLOUDINARY_API_KEY="your_api_key"
   CLOUDINARY_API_SECRET="your_api_secret"
   CLOUDINARY_DEFAULT_FOLDER="safus-restaurant"
   RESEND_API_KEY="your_resend_key"
   STRIPE_SECRET_KEY="your_stripe_key"
   ```

4. **Sync Schema & Seed Sample Data**:
   ```bash
   npx prisma db push
   npm run seed
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
