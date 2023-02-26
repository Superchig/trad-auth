export interface Account {
  id: number | undefined;
  full_name: string | undefined;
  balance: number | undefined;
}

export const hasAncestors = (account: Account): boolean | undefined => {
  return account.full_name?.includes(':');
};
