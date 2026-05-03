import { z } from 'zod';

export const signupSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email().toLowerCase(),
    password: z.string().min(6),
    role: z.enum(['CUSTOMER', 'VENDOR']).default('CUSTOMER'),

  })


export type SignUpInput = z.infer<typeof signupSchema>;
