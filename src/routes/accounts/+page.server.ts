import { findAllAccountsIdNameBalance } from '$lib/accounts';
import { getPool } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const pool = await getPool();

  const results = await pool.connect(async (conn) => {
    return await findAllAccountsIdNameBalance(conn);
  });

  return structuredClone({
    accounts: results
  });
};
