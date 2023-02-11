import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => {
  return {
    // FIXME(Chris): Remove this
    count: 5,
  }
}
