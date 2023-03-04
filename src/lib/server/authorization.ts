import type { ValidRoute } from '$lib/routes';
import type { UserInfo } from '$lib/server/user_info';

export const publicRoutesValid: ValidRoute[] = ['/', '/user/login'];
export const publicRoutes: String[] = publicRoutesValid;

export const basicAuthRoute: ValidRoute = '/cli';

export const possibleUserRedirect = (
  user: UserInfo | undefined,
  route: string | null
): Response | null => {
  const isLoggedIn = user !== undefined;
  const isPublicRoute = route !== null && publicRoutes.includes(route);
  const isAuthorizedByBasicAuth = route !== null && route == basicAuthRoute;
  if (isLoggedIn || isPublicRoute || isAuthorizedByBasicAuth) {
    return null;
  } else {
    const homeRoute: ValidRoute = '/';
    const errorMessage = {
      msg: 'Not logged in - redirecting'
    };
    return new Response(JSON.stringify(errorMessage), {
      status: 302,
      headers: { location: homeRoute }
    });
  }
};
