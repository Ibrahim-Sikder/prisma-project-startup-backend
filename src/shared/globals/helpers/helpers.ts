import { config } from '@config/config';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class Helpers {
  public static hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  public static comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static generateAccessToken(payload: any) {
    return jwt.sign(payload, config.JWT_TOKEN, {
      expiresIn: '15m',
    });
  }

  static generateRefreshToken(payload: any) {
    return jwt.sign(payload, config.JWT_REFRESH_TOKEN, {
      expiresIn: '7d',
    });
  }

  static verifyRefreshToken(token: string) {
    return jwt.verify(token, config.JWT_REFRESH_TOKEN);
  }
}
