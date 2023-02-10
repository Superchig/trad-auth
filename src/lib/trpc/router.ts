import type { Context } from '$lib/trpc/context';
import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { createPool, sql } from 'slonik';
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

      const pool = await createPool('postgres://postgres:password@localhost:5432/trad-auth');

      pool.connect(async (connection) => {
        const result = await connection.query(
          sql.type(
            z.number()
          )`INSERT INTO users (username, email, password) VALUES (${input.username}, ${input.email}, ${saltedHashedPass}) RETURNING id;`
        );
        console.log(result);
      });

      await pool.end();

      return 22;
    })
});

export type Router = typeof router;

const NewUserRequest = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string()
});

export type NewUserRequest = z.infer<typeof NewUserRequest>;
