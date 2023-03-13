import { router, protectedProcedure } from '$lib/trpc/router';
import { Account } from '$lib/account';
import { getPool, schemaId, schemaVoid } from '$lib/server/db';
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
      // TODO(Chris): Prevent a new child account from having `:` in its name

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
    }),
  // FIXME(Chris): Write a spec or integration test for this countChildren procedure
  countChildren: protectedProcedure
    .input((val: unknown) => {
      return z
        .object({
          accountId: z.number()
        })
        .parse(val);
    })
    .query(async ({ input }) => {
      const pool = await getPool();

      const transactionResult = await pool.transaction(async (conn) => {
        const schema = z.object({ count_children: z.number() });
        const query = sql.type(schema)`SELECT COUNT(*) - 1 AS count_children
                                       FROM account_closure
                                       WHERE ancestor_id = ${input.accountId}`;

        return conn.one(query);
      });

      return transactionResult;
    }),
  // FIXME(Chris): Write a spec or integration test for this deleteWithAllChildren procedure
  // FIXME(Chris): Write test for this deleteWithAllChildren procedure when an account has grandchildren
  deleteWithAllChildren: protectedProcedure
    .input((val: unknown) => {
      return z
        .object({
          accountId: z.number()
        })
        .parse(val);
    })
    .query(async ({ input }) => {
      const pool = await getPool();

      const transactionResult = await pool.transaction(async (conn) => {
        const schema1 = z.object({
          descendant_id: z.number()
        });

        // NOTE(Chris): For all accounts that are related to the descendants of input.accountId, we should delete them.
        // If d.ancestor_id = input.accountId, then d.descendant_id is a descendant of :TO_DELETE.
        // Thus, we should delete all ancestors and descendants of d.descendant_id.

        // We also want to delete all ancestor relationships of input.accountId.
        // And we want to return all of the descendants of input.accountId.

        // We accomplish these two things by way of an OR condition.
        // The first clause finds all accounts which are related to the descendants of input.accountId.
        // The second clause finds all accounts which are ancestors of input.accountId;
        // Finally, the RETURNING statement ensures that all descendant IDs of input.accountId are returned.

        const query1 = sql.type(schema1)`DELETE
                                         FROM account_closure relation_to_d USING account_closure d
                                         WHERE (d.ancestor_id = ${input.accountId}
                                             AND (relation_to_d.ancestor_id = d.descendant_id OR relation_to_d.descendant_id = d.descendant_id))
                                            OR relation_to_d.ancestor_id = ${input.accountId}
                                         RETURNING relation_to_d.descendant_id AS descendant_id;`;

        const queryResult1 = await conn.many(query1);
        const descendantIdsWithDuplicates = queryResult1.map(({ descendant_id }) => descendant_id);
        const descendantIds = [...new Set(descendantIdsWithDuplicates)];
        const joinedDescendantIds = sql.join(descendantIds, sql.fragment`, `);

        const query2 = sql.type(schemaId)`DELETE FROM account WHERE id IN (${joinedDescendantIds})`;
        return await conn.query(query2);
      });
    })
});

export const NewChildRequest = z.object({
  name: z.string(),
  parentAccountId: z.number()
});

export type NewChildRequest = z.infer<typeof NewChildRequest>;
