import { router, protectedProcedure } from '$lib/trpc/router';
import { Account } from '$lib/account';

export const accountRouter = router({
  new: protectedProcedure
    .input((val: unknown) => {
      return Account.parse(val);
    })
    .query(async ({ input }) => {
      // FIXME(Chris): Implement this tRPC procedure
      console.log(input);
    })
});
