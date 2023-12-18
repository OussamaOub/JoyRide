import { z } from 'zod';

export const userSchema:Zod.Schema = z.object({
    username: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    password: z.string(),
    });
  