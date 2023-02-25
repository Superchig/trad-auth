import type { RequestHandler } from './$types';
import { dev } from '$app/environment';
import { NewUserRequest } from '$lib/trpc/router';
import { newUser } from '$lib/server/user';
import { getPool } from '$lib/server/db';
import { BASIC_AUTH_LOGIN } from '$env/static/private';

const wantedAuth = Buffer.from(BASIC_AUTH_LOGIN, 'utf-8').toString('base64');

export const POST: RequestHandler = async (event) => {
  const auth = event.request.headers.get('Authorization');

  if (auth !== `Basic ${wantedAuth}`) {
    return new Response('Not authorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': `Basic realm="User Visible Realm", charset="UTF-8"`
      }
    });
  }

  const args = NewUserRequest.parse(await event.request.json());

  const pool = await getPool();

  await newUser(pool, args, 'admin');

  return new Response('Created new admin user');
};
