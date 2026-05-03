import { prisma } from '@config/db';
import type { Prisma, User } from '@root/generated/prisma';

type SafeUser = Omit<User, 'password'>;

class UserService {
  /**
   * Get a user by ID, excluding password from the result.
   */
  public getUserById(id: string): Promise<SafeUser | null> {
    return prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });
  }

  /**
   * Get a user by ID including password (needed for change-password verification).
   */
  public getUserByIdWithPassword(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  /**
   * Update a user's profile fields (only updatable fields — name, etc.).
   */
  public updateProfile(id: string, data: Prisma.UserUpdateInput): Promise<SafeUser> {
    return prisma.user.update({
      where: { id },
      data,
      omit: { password: true },
    });
  }

  /**
   * Update a user's password hash.
   */
  public changePassword(id: string, hashedPassword: string): Promise<SafeUser> {
    return prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
      omit: { password: true },
    });
  }
}

export const userService = new UserService();
