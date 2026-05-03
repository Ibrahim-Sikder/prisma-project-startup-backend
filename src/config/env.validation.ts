import dotenv from 'dotenv';
import { z } from 'zod';
import { Logger } from '@config/logger';

dotenv.config();

const logger = new Logger('env-validation');

const schema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']),

    PORT: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((num) => !isNaN(num) && num > 0, {
        message: 'PORT must be a positive integer',
      }),

    API_URL: z.string().url('API_URL must be a valid URL'),

    DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),

    JWT_TOKEN: z.string().min(32, 'JWT secret must be at least 32 chars'),
    JWT_REFRESH_TOKEN: z.string().min(32, 'JWT refresh secret must be at least 32 chars'),

    CLIENT_URL: z.string().url('CLIENT_URL must be a valid URL'),

    REDIS_URL: z.string().url('REDIS_URL must be a valid URL'),

    CLOUD_NAME: z.string().min(1, 'CLOUD_NAME is required'),
    CLOUD_API_KEY: z.string().min(1, 'CLOUD_API_KEY is required'),
    CLOUD_API_SECRET: z.string().min(1, 'CLOUD_API_SECRET is required'),

    // Email (optional but validated if present)
    SENDER_EMAIL: z.string().email().optional(),
    SENDER_EMAIL_PASSWORD: z.string().min(1).optional(),

    // SendGrid (optional but validated if present)
    SENDGRID_API_KEY: z.string().optional(),
    SENDGRID_SENDER: z.string().email().optional(),
  })
  .superRefine((data, ctx) => {
    // Ensure at least ONE email method is configured
    const hasSMTP = data.SENDER_EMAIL && data.SENDER_EMAIL_PASSWORD;
    const hasSendGrid = data.SENDGRID_API_KEY && data.SENDGRID_SENDER;

    if (!hasSMTP && !hasSendGrid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Either SMTP (SENDER_EMAIL + PASSWORD) or SendGrid must be configured',
        path: ['SENDER_EMAIL'],
      });
    }
  });

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  logger.error('Invalid environment variables', parsed.error.format(), 'EnvValidation');

  process.exit(1);
}

export const env = parsed.data;
export type Env = z.infer<typeof schema>;
