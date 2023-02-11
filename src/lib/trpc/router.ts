import type { Context } from '$lib/trpc/context';
import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { sql } from 'slonik';
import { pool } from '$lib/server/db';
import argon2 from 'argon2';

export const t = initTRPC.context<Context>().create();

export const router = t.router({
  newUser: t.procedure
    .input((val: unknown) => {
      return NewUserRequest.parse(val);
    })
    .query(async (req) => {
      const { input } = req;

      // NOTE(Chris): Though we do not input a secret, this will salt and hash
      // the password. Using `argon2.hash()` multiple times on the same input
      // will result in a different output.
      const saltedHashedPass = await argon2.hash(input.password);

      // FIXME(Chris): See if you can wrap this whole TRPC router in some kind
      // of middleware that can catch Slonik errors
      // https://github.com/gajus/slonik#error-handling

      const sessionId = await pool.transaction(async (connection) => {
        console.log('In transaction: beginning');
        const result = await connection.query(
          sql.type(
            z.number()
          )`INSERT INTO user_account (username, email, password) VALUES (${input.username}, ${input.email}, ${saltedHashedPass}) RETURNING id;`
        );

        console.log('In transaction: middle');

        const newUserId = result.rows[0];

        const sessionId = await connection.query(
          sql.type(
            z.string().uuid()
          )`INSERT INTO user_session (user_account_id) VALUES (${newUserId}) RETURNING id;`
        );

        console.log('In transaction: end');

        return sessionId.rows[0];
      });

      return sessionId;
    })
});

export type Router = typeof router;

const NewUserRequest = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string()
});

export type NewUserRequest = z.infer<typeof NewUserRequest>;
