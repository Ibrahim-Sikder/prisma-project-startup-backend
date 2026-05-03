import { prisma } from '@config/db';
import { UserRole, type Prisma, type User } from '@root/generated/prisma';

class AuthService {
  public getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  public getUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  public createUser(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }


}

export const authService = new AuthService();
