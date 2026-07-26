import app from './app';
import prisma from './config/db';
import env from './config/env';

async function main() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully!');

    app.listen(env.PORT, () => {
      console.log(`🚀 SaFus Server is running on port ${env.PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to Database:', err);
    process.exit(1);
  }
}

main();
