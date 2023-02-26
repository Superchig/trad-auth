import type { Account } from '$lib/account';
import { sql, type DatabaseConnection } from 'slonik';
import { number, z } from 'zod';

// FIXME(Chris): See if we can refactor these functions to return queries rather
// than make them

export async function findAllAccountsIdName(conn: DatabaseConnection): Promise<readonly Account[]> {
  // NOTE(Chris): We obtain the full names (all of the ancestors + the specific name)
  // for all of the accounts with this query.
  // However, SQLite does not guarantee the order of concatenated elements when using
  // GROUP_CONCAT, so we need to use this sub-query within a sub-query.
  // https://stackoverflow.com/questions/1897352/sqlite-group-concat-ordering
  // Using the closure table will allow us to quickly find all of the anestors of
  // an account without using a recursive query
  // https://dirtsimple.org/2010/11/simplest-way-to-do-tree-based-queries.html

  // FIXME(Chris): Change this type to use Zod
  const mid = await conn.query(
    sql.type(
      z.object({
        id: z.number(),
        full_name: z.string(),
        balance: z.number()
      })
    )`SELECT a.id,
          (SELECT STRING_AGG(ordered_ancestor.name, ':')
           FROM (SELECT account.name AS name
                 FROM account_closure
                     INNER JOIN account ON account.id = account_closure.ancestor_id
                 WHERE descendant_id = a.id
                 ORDER BY depth DESC) AS ordered_ancestor) AS full_name
      FROM account a
      GROUP BY id
      ORDER BY full_name;`
  );

  const results = mid.rows;

  return results;
}

export async function findAllAccountsIdNameBalance(
  conn: DatabaseConnection
): Promise<readonly Account[]> {
  // FIXME(Chris): Change this type to use Zod
  const mid = await conn.query(
    sql.type(
      z.object({
        id: z.number(),
        full_name: z.string(),
        balance: z.number()
      })
    )`SELECT a.id                                                 AS id,
         (SELECT GROUP_CONCAT(ordered_ancestor.name, ':')
          FROM (SELECT account.name AS name
                FROM account_closure
                         INNER JOIN account ON account.id = account_closure.ancestor_id
                WHERE descendant_id = a.id
                ORDER BY depth DESC) AS ordered_ancestor)     AS full_name,
         (SELECT COALESCE(SUM(debit_credit_amount), 0)
          FROM full_transaction_view ftv
               -- This WHERE clause consists of the IDs of the account and its descendants
          WHERE ftv.account_id IN (SELECT descendant_id
                                   FROM account_closure
                                            INNER JOIN account ftv_a on ftv_a.id = account_closure.descendant_id
                                   WHERE ancestor_id = a.id)) AS balance
      FROM account a
      GROUP BY id
      ORDER BY full_name;`
  );

  const results = mid.rows;

  return results;
}
