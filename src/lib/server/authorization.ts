import type { ValidRoute } from '$lib/routes';
import type { RequestEvent } from '@sveltejs/kit';

export const publicRoutesValid: ValidRoute[] = ['/', '/user/login'];
export const publicRoutes: String[] = publicRoutesValid;

export const basicAuthRoute: ValidRoute = '/cli';

export const possibleUserRedirect = (event: RequestEvent): Response | null => {
  const isLoggedIn = event.locals.user !== undefined;
  const isPublicRoute = event.route.id !== null && publicRoutes.includes(event.route.id);
  const isAuthorizedByBasicAuth = event.route.id !== null && event.route.id == basicAuthRoute;
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
