import type { Context } from '$lib/trpc/context';
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

export const t = initTRPC.context<Context>().create();

export const router = t.router({
  newUser: t.procedure
    .input((val: unknown) => {
      return NewUserRequest.parse(val);
    })
    .query((req) => {
      const { input } = req;

      console.log(input);

      return 22;
    })
});

export type Router = typeof router;

const NewUserRequest = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string()
});

export type NewUserRequest = z.infer<typeof NewUserRequest>;