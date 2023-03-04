import type { Account } from '$lib/account';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  // FIXME(Chris)

  const results: Account[] = [
    {
      id: 1,
      full_name: 'assets',
      balance: 0
    }
  ];

  return structuredClone({
    accounts: results
  });
};
