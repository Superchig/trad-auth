import type { RequestHandler } from './$types';
import { dev } from '$app/environment';
import { NewUserRequest } from '$lib/trpc/router';
import { newUser } from '$lib/server/user';
import { pool } from '$lib/server/db';

export const POST: RequestHandler = async (event) => {
  if (!dev) {
    return new Response("This is only available in development!", { status: 401 });
  }

  const args = NewUserRequest.parse(await event.request.json())

  await newUser(pool, args, 'admin');

  return new Response("Created new admin user");
}
