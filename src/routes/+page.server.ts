import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ cookies }) => {
  return {
    sessionId: cookies.get('sessionId'),
  }
}
