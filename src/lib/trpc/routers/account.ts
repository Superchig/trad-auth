import { router, protectedProcedure } from '$lib/trpc/router';

export const accountRouter = router({
  foo: protectedProcedure.query(async ({ input }) => {
    console.log('In foo procedure');
  })
});
