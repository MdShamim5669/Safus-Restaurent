# Database Design — SaFus Restaurant (PostgreSQL / Neon via Prisma)

## Entity Overview
`User` 1—N `Order`, `Reservation`, `Review`, `CartItem`
`Order` 1—1 `Payment`
`Order` N—N `Menu` (through `OrderItem`)
`User` 1—N `Otp`

## Prisma Schema (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  ADMIN
  CUSTOMER
}

enum OrderStatus {
  PENDING
  PAID
  PREPARING
  DELIVERED
  CANCELLED
}

enum PaymentGateway {
  STRIPE
  SSLCOMMERZ
}

enum PaymentStatus {
  PENDING
  SUCCESS
  FAILED
}

model User {
  id           String        @id @default(uuid())
  name         String
  email        String        @unique
  password     String
  role         Role          @default(CUSTOMER)
  isVerified   Boolean       @default(false)
  photoUrl     String?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  cartItems    CartItem[]
  orders       Order[]
  reservations Reservation[]
  reviews      Review[]
  otps         Otp[]
}

model Otp {
  id        String   @id @default(uuid())
  userId    String
  code      String
  expiresAt DateTime
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Menu {
  id         String   @id @default(uuid())
  name       String
  recipe     String
  category   String
  price      Float
  imageUrl   String
  videoUrl   String?
  createdAt  DateTime @default(now())

  cartItems  CartItem[]
  orderItems OrderItem[]
}

model CartItem {
  id       String @id @default(uuid())
  userId   String
  menuId   String
  quantity Int    @default(1)

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  menu Menu @relation(fields: [menuId], references: [id], onDelete: Cascade)
}

model Order {
  id        String      @id @default(uuid())
  userId    String
  status    OrderStatus @default(PENDING)
  total     Float
  createdAt DateTime    @default(now())

  user    User        @relation(fields: [userId], references: [id])
  items   OrderItem[]
  payment Payment?
}

model OrderItem {
  id       String @id @default(uuid())
  orderId  String
  menuId   String
  quantity Int
  price    Float

  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)
  menu  Menu  @relation(fields: [menuId], references: [id])
}

model Payment {
  id        String         @id @default(uuid())
  orderId   String         @unique
  gateway   PaymentGateway
  status    PaymentStatus  @default(PENDING)
  amount    Float
  txnId     String?
  createdAt DateTime       @default(now())

  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)
}

model Reservation {
  id        String   @id @default(uuid())
  userId    String
  date      DateTime
  time      String
  guests    Int
  note      String?
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Review {
  id        String   @id @default(uuid())
  userId    String
  rating    Int
  details   String
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## Notes
- `Menu.imageUrl` / `videoUrl` store Cloudinary URLs only — no binary in Postgres.
- `Otp` rows can be pruned via a scheduled job (expiresAt < now).
- Neon is used purely as the managed Postgres host; Prisma talks to it over `DATABASE_URL` (use the pooled connection string for serverless deploys).
