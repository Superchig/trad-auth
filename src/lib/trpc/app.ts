import { accountRouter } from '$lib/trpc/routers/account';
import { userRouter } from '$lib/trpc/routers/user';
import { router } from './router';

export const appRouter = router({
  user: userRouter,
  account: accountRouter
});

// FIXME(Chris): Rename this to AppRouter
export type Router = typeof appRouter;