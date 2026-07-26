import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const sampleMenuItems = [
  // Pizzas
  {
    name: 'Margherita Supreme Pizza',
    recipe: 'Classic Italian pizza topped with fresh mozzarella, cherry tomatoes, and aromatic basil leaves.',
    category: 'pizza',
    price: 14.99,
    imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'BBQ Chicken Feast Pizza',
    recipe: 'Tender grilled chicken breast bits, smoky BBQ sauce, red onions, cilantro, and melted gouda cheese.',
    category: 'pizza',
    price: 18.50,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Pepperoni Overload Pizza',
    recipe: 'Loaded with double layers of crispy beef pepperoni, spicy tomato sauce, and double mozzarella.',
    category: 'pizza',
    price: 16.99,
    imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=800&auto=format&fit=crop',
  },

  // Salads
  {
    name: 'Classic Caesar Salad',
    recipe: 'Crisp romaine lettuce hearts, garlic-herb croutons, shaved parmesan, and creamy homemade Caesar dressing.',
    category: 'salad',
    price: 9.99,
    imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Greek Feta & Olive Salad',
    recipe: 'Juicy vine tomatoes, crisp cucumbers, Kalamata olives, red onions, and creamy Greek feta cheese dressed with extra virgin olive oil.',
    category: 'salad',
    price: 11.50,
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop',
  },

  // Soups
  {
    name: 'Roasted Tomato Basil Soup',
    recipe: 'Rich and velvety slow-roasted ripe tomato soup garnished with fresh basil oil and served with toasted sourdough crusts.',
    category: 'soup',
    price: 7.99,
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Wild Mushroom Cream Soup',
    recipe: 'Earthy wild porcini and button mushrooms simmered in fresh herbs and finished with a splash of heavy cream.',
    category: 'soup',
    price: 8.99,
    imageUrl: 'https://images.unsplash.com/photo-1588566565463-180a5b2090d2?q=80&w=800&auto=format&fit=crop',
  },

  // Desserts
  {
    name: 'Rich Chocolate Lava Cake',
    recipe: 'Warm dark chocolate cake with a molten lava chocolate core, served with Madagascar vanilla bean ice cream.',
    category: 'dessert',
    price: 8.50,
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Classic Italian Tiramisu',
    recipe: 'Espresso-soaked ladyfinger biscuits layered with rich whipped mascarpone cream and dusted with cocoa powder.',
    category: 'dessert',
    price: 7.99,
    imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=800&auto=format&fit=crop',
  },

  // Drinks
  {
    name: 'Fresh Mint Lime Mojito',
    recipe: 'Refreshing mocktail crafted with fresh crushed mint leaves, lime juice, cane sugar, and sparkling soda water.',
    category: 'drinks',
    price: 5.99,
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Iced Caramel Macchiato',
    recipe: 'Rich espresso poured over chilled milk, sweetened with vanilla syrup and topped with buttery caramel drizzle.',
    category: 'drinks',
    price: 6.50,
    imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=800&auto=format&fit=crop',
  },
];

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Seed Admin User
  const adminEmail = 'admin@safus.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123456', 10);
    const admin = await prisma.user.create({
      data: {
        name: 'SaFus Master Admin',
        email: adminEmail,
        password: hashedPassword,
        role: Role.ADMIN,
        isVerified: true,
        photoUrl: 'https://res.cloudinary.com/shamcloud/image/upload/v1700000000/safus-restaurant/admin_avatar.png',
      },
    });
    console.log(`✅ Admin account created: ${admin.email} (Password: admin123456)`);
  } else {
    console.log(`ℹ️ Admin account already exists: ${existingAdmin.email}`);
  }

  // 2. Seed Sample Menu Items
  let seededMenuCount = 0;
  for (const item of sampleMenuItems) {
    const existingItem = await prisma.menu.findFirst({
      where: { name: item.name },
    });

    if (!existingItem) {
      await prisma.menu.create({
        data: item,
      });
      seededMenuCount++;
    }
  }

  console.log(`✅ Seeded ${seededMenuCount} sample menu items.`);
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
