import type { LayoutServerLoad } from './$types';
import { getCurrentTab } from '$lib/navbar_tab';

export const load: LayoutServerLoad = async ({ locals, url }) => {
  return {
    user: locals.user,
    currentTab: getCurrentTab(url.pathname)
  };
};
