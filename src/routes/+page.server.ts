import { get_query } from "$lib/server/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => {
  return {
    count: get_query(),
  }
}
