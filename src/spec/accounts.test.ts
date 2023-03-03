import { findAllAccountsIdName } from '$lib/accounts';
import { getPool, schemaVoid } from '$lib/server/db';
import { sql } from 'slonik';
import { describe, it, expect, afterAll, beforeAll } from 'vitest';

describe('accounts.ts', () => {
  beforeAll(async () => {
    const pool = await getPool();

    // TODO(Chris): Refactor into own function upon rule-of-3
    pool.connect(async (conn) => {
      await conn.query(sql.type(schemaVoid)`
        TRUNCATE account_closure;
        TRUNCATE debit_credit;
        TRUNCATE account;
        TRUNCATE financial_transaction;
        TRUNCATE user_session;
        TRUNCATE user_account;
      `);
    });
  });
  describe(findAllAccountsIdName.name, () => {
    it('uses valid SQL', async () => {
      const pool = await getPool();

      pool.connect(async (conn) => {
        await findAllAccountsIdName(conn);
      });

      // No expectation, we just need the query to execute successfully
    });
    it('returns the correct output', async () => {
      const pool = await getPool();

      pool.connect(async (conn) => {
        await findAllAccountsIdName(conn);
      });

      // FIXME(Chris): Add new expectation
    });
  });
});
