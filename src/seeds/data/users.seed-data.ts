import type { Prisma } from '@root/generated/prisma';
import { UserRole } from '@root/generated/prisma';

export const usersSeedData: Prisma.UserCreateInput[] = [
  {
    email: 'test@gmail.com',
    password: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36iQoe8jMZyTnA.1r0u',
    name: 'Demo User',
    role: UserRole.USER,
  },
];
