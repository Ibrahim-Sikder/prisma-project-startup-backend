import { PrismaPg } from '@prisma/adapter-pg';
import { config } from './config';
import { PrismaClient } from '@root/generated/prisma';
const adapter = new PrismaPg({
  connectionString: config.DATABASE_URL,
});

export const prisma = new PrismaClient({ adapter });

export const connectDatabase = async (): Promise<void> => {
  await prisma.$connect();
};

export const disconnectDatabase = async (): Promise<void> => {
  await prisma.$disconnect();
};
