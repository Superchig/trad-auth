import { router, protectedProcedure } from '$lib/trpc/router';
import { Account } from '$lib/account';
import { getPool } from '$lib/server/db';
import { z } from 'zod';
import { sql } from 'slonik';

export const accountRouter = router({
  new: protectedProcedure
    .input((val: unknown) => {
      return Account.parse(val);
    })
    .query(async ({ input }) => {
      const pool = await getPool();

      const result = await pool.connect(async (conn) => {
        const query = sql.type(z.void())`INSERT INTO account(name) VALUES (${input.full_name!});`;

        return conn.query(query);
      });

      return result;
    }),
  newChild: protectedProcedure
    .input((val: unknown) => {
      return { foo: 'bar' };
    })
    .query(async ({ input: { foo } }) => {
      throw new Error("This is an example error.");
    })
});
