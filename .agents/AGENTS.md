# SaFus Project Rules

## Backend Code Standards (`server/`)
- **Layering**: Maintain strict separation between Routes, Controllers, Services, and Validations in every feature under `server/module/<feature>/`. Business logic must live in Services, NOT Controllers.
- **Validation**: All incoming mutation requests MUST pass through `validateRequest(schema)` middleware using Zod schemas.
- **Database**: Use Prisma Client singleton (`config/db.ts`) for all database operations. Never raw SQL unless explicitly required.
- **Responses**: Standardize API responses using the `sendResponse` utility and handle async errors with `catchAsync`.
- **Media**: Upload media (images/videos) to Cloudinary targeting the `'safus-restaurant'` folder (`uploadToCloudinary` or `folder: 'safus-restaurant'`) and store only HTTPS CDN URLs in PostgreSQL (`Menu.imageUrl`, `Menu.videoUrl`, `User.photoUrl`).
- **Payments & Orders**: Maintain atomic state updates across `Payment` and `Order` using Prisma transactions (`prisma.$transaction`).
