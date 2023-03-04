import { accountsPath, transactionsPath } from "./routes";

export enum NavbarTab {
  Transactions = 1,
  Accounts
}

export function getCurrentTab(pathname: string): NavbarTab {
  let currentTab = NavbarTab.Transactions;

  if (pathname.startsWith(accountsPath())) {
    currentTab = NavbarTab.Accounts;
  } else if (pathname.startsWith(transactionsPath())) {
    currentTab = NavbarTab.Transactions;
  }

  return currentTab;
}