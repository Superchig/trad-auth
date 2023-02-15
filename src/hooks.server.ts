import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
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
  )
  return response;
}

export const handle: Handle = sequence(tRPCHandle, httpLoggerHandle);
