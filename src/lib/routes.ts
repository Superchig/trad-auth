export type ValidRoute = '/' | '/user/new' | '/user/login';

export const validRoute = (route: ValidRoute): string => {
  return route;
}