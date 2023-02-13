import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ cookies }) => {
  return {
    isSignedIn: cookies.get('sessionId') !== undefined,
  }
}
