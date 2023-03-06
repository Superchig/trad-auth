import type { Context } from '$lib/trpc/context';
import { initTRPC, TRPCError } from '@trpc/server';

export const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(({ next, ctx }) => {
  const user = ctx.event.locals.user;

  if (user === undefined) {
    throw new TRPCError({
      code: 'UNAUTHORIZED'
    });
  }

  return next({
    ctx
  });
});

export const publicProcedure = t.procedure;
// FIXME(Chris): Use this to create a protected procedure
export const protectedProcedure = t.procedure.use(isAuthed);

export const router = t.router;
