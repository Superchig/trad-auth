import { findAllAccountsIdName } from '$lib/accounts';
import { getPool } from '$lib/server/db';
import { describe, it, expect, afterAll } from 'vitest';

describe('accounts.ts', () => {
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
