import { z } from 'zod';

export const Account = z.object({
  id: z.number().optional(),
  full_name: z.string().optional(),
  balance: z.number().optional()
});

export type Account = z.infer<typeof Account>;

export const hasAncestors = (account: Account): boolean | undefined => {
  return account.full_name?.includes(':');
};
