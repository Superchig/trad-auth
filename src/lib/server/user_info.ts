import { z } from 'zod';

export const UserInfo = z.object({
  username: z.string(),
  email: z.string().email()
});

export type UserInfo = z.infer<typeof UserInfo>;
