import { pool } from '$lib/server/db';
import { UserInfo } from '$lib/server/user_info';
import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { sql } from 'slonik';
import { createTRPCHandle } from 'trpc-sveltekit';

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
  const response = await resolve(event);

  if (!sessionId) {
    return response;
  }

  const matchingUsers = await pool.transaction(async (connection) => {
    return await connection.query(sql.type(
      UserInfo
    )`SELECT user_account.username, user_account.email
      FROM user_account
          INNER JOIN user_session us on user_account.id = us.user_account_id
      WHERE us.id = ${sessionId};`);
  });

  if (matchingUsers.rowCount >= 1) {
    process.stdout.write("event.locals.user: ");
    event.locals.user = structuredClone(matchingUsers.rows[0]);
    console.log(event.locals.user);
  }

  return response;
};

export const handle: Handle = sequence(tRPCHandle, httpLoggerHandle, authenticationHandle);
