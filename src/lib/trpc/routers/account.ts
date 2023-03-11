import { router, protectedProcedure } from '$lib/trpc/router';
import { Account } from '$lib/account';
import { getPool, schemaId } from '$lib/server/db';
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
  // FIXME(Chris): Write a spec or integration test for this newChild procedure
  newChild: protectedProcedure
    .input((val: unknown) => {
      return NewChildRequest.parse(val);
    })
    .query(async ({ input }) => {
      const pool = await getPool();

      const transactionResult = await pool.transaction(async (conn) => {
        const query1 = sql.type(
          schemaId
        )`INSERT INTO account(name) VALUES (${input.name!}) RETURNING id;`;

        const queryResult1 = await conn.query(query1);
        const newAccountId = queryResult1.rows[0].id;

        const query2 = sql.type(
          z.void()
        )`INSERT INTO account_closure(ancestor_id, descendant_id, depth)
          SELECT p.ancestor_id, c.descendant_id, p.depth + c.depth + 1
          FROM account_closure p
              CROSS JOIN account_closure c
          WHERE p.descendant_id = ${input.parentAccountId} AND c.ancestor_id = ${newAccountId}`;

        const queryResult2 = await conn.query(query2);

        return queryResult2;
      });

      const result = transactionResult.rows[0];

      return result;
    })
});

export const NewChildRequest = z.object({
  name: z.string(),
  parentAccountId: z.number()
});

export type NewChildRequest = z.infer<typeof NewChildRequest>;
