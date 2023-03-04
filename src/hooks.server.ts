import type { ValidRoute } from '$lib/routes';
import { getPool } from '$lib/server/db';
import { UserInfo } from '$lib/server/user_info';
import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';
import type { Handle, RequestEvent, ResolveOptions } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { sql } from 'slonik';
import { createTRPCHandle } from 'trpc-sveltekit';
import { inspect } from 'util';

const tRPCHandle = createTRPCHandle({ router, createContext });

// NOTE(Chris): From https://old.reddit.com/r/sveltejs/comments/xtbkpb/how_are_you_logging_http_requests_in_sveltekit/
const httpLoggerHandle: Handle = async ({ event, resolve }) => {
  const requestStartTime = Date.now();
  const response = await resolve(event);

  console.log(
    new Date(requestStartTime).toISOString(),
    event.request.method,
    event.url.pathname,
    `(${Date.now() - requestStartTime}ms)`,
    response.status
  );
  return response;
};

const authenticationHandle: Handle = async ({ event, resolve }) => {
  const sessionId = event.cookies.get('sessionId');

  if (!sessionId) {
    return await resolve(event);
  }

  const pool = await getPool();

  const matchingUsers = await pool.transaction(async (connection) => {
    return await connection.query(sql.type(
      UserInfo
    )`SELECT user_account.username, user_account.email
      FROM user_account
          INNER JOIN user_session us on user_account.id = us.user_account_id
      WHERE us.id = ${sessionId};`);
  });

  if (matchingUsers.rowCount >= 1) {
    event.locals.user = structuredClone(matchingUsers.rows[0]);
  }

  return await resolve(event);
};

const publicRoutesValid: ValidRoute[] = ['/', '/user/login'];
const publicRoutes: String[] = publicRoutesValid;

// NOTE(Chris): This type is from https://kit.svelte.dev/docs/types#private-types-maybepromise
type MaybePromise<T> = T | Promise<T>;
// NOTE(Chris): This type is adapted from https://kit.svelte.dev/docs/types#public-types-handle
type Resolve = (event: RequestEvent, opts?: ResolveOptions) => MaybePromise<Response>;

const routeAuthorizationHandle: Handle = async ({ event, resolve }) => {
  if (
    event.locals.user !== undefined ||
    (event.route.id !== null && publicRoutes.includes(event.route.id))
  ) {
    return await resolve(event);
  } else {
    const homeRoute: ValidRoute = '/';
    console.log('Not logged in - redirecting');
    const errorMessage = {
      msg: 'Not logged in - redirecting'
    };
    return new Response(JSON.stringify(errorMessage), {
      status: 302,
      headers: { location: homeRoute }
    });
  }
};

// FIXME(Chris): Test (automatically) if a non-logged in person can access the tPRC calls

export const handle: Handle = sequence(
  authenticationHandle,
  tRPCHandle,
  routeAuthorizationHandle,
  httpLoggerHandle
);
