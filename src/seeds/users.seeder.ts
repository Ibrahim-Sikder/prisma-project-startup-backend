import { usersSeedData } from './data/users.seed-data';
import type { SeedTask } from './types';
import { config } from '@config/config';

export const usersSeeder: SeedTask = {
  name: 'users',
  run: async ({ prisma }) => {
    for (const userData of usersSeedData) {
      const user = await prisma.user.upsert({
        where: {
          email: userData.email,
        },
        update: {
          name: userData.name,
        },
        create: userData,
      });

      config.logger.info(`Upserted user: ${user.email} (ID: ${user.id})`, {
        userId: user.id,
        email: user.email,
      });
    }
  },
};
