import type { PrismaClient } from '@root/generated/prisma';

export type SeedContext = {
  prisma: PrismaClient;
};

export type SeedTask = {
  name: string;
  run: (context: SeedContext) => Promise<void>;
};
