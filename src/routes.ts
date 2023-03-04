export function deleteWithAllChildrenPath() {
  return '?/delete_with_all_children';
}

export function countChildrenPath(accountId: number) {
  return `/accounts/${accountId}/count_children`;
}

export function createChildAccount() {
  return `?/create_child_account`;
}

export function accountsPath() {
  return `/accounts`;
}

export function transactionsPath() {
  return `/transactions`;
}