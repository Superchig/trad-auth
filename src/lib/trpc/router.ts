import type { Context } from '$lib/trpc/context';
import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { ConnectionError, sql } from 'slonik';
import { pool } from '$lib/server/db';
import argon2 from 'argon2';

export const t = initTRPC.context<Context>().create();

// NOTE(Chris): Defining this here gives us more type-safety than using string
// type aliases
// https://github.com/gajus/slonik#type-aliases
const schemaId = z.object({
  id: z.number()
});
const schemaVoid = z.object({
  void: z.object({}).strict()
});
const schemaUuid = z.object({
  id: z.string().uuid()
});

export const router = t.router({
  newUser: t.procedure
    .input((val: unknown) => {
      return NewUserRequest.parse(val);
    })
    .query(async (req): Promise<string> => {
      const { input } = req;

      // NOTE(Chris): Though we do not input a secret, this will salt and hash
      // the password. Using `argon2.hash()` multiple times on the same input
      // will result in a different output.
      const saltedHashedPass = await argon2.hash(input.password);

      const sessionId = await pool.transaction(async (connection) => {
        const result = await connection.query(
          sql.type(
            schemaId
          )`INSERT INTO user_account (username, email, password) VALUES (${input.username}, ${input.email}, ${saltedHashedPass}) RETURNING id;`
        );

        const newUserId = result.rows[0].id;

        const sessionId = await connection.query(
          sql.type(
            schemaUuid
          )`INSERT INTO user_session (id, user_account_id) VALUES (gen_random_uuid(), ${newUserId}) RETURNING id;`
        );

        return sessionId.rows[0].id;
      });

      return sessionId;
    }),
  logIn: t.procedure
    .input((val: unknown) => {
      return LogInRequest.parse(val);
    })
    .query(async ({ input }) => {
      return await pool.transaction(async (connection) => {
        const result = (
          await connection.query(sql.type(
            z.object({
              id: z.string().uuid(),
              password: z.string()
            })
          )`SELECT user_session.id, ua.password
            FROM user_session
                     INNER JOIN user_account ua on user_session.user_account_id = ua.id
            WHERE ua.email = ${input.email};`)
        ).rows[0];

        try {
          if (await argon2.verify(result.password, input.password)) {
            return result.id; // Session ID
          } else {
            // FIXME(Chris): Figure out way to return invalid password error
            return null;
          }
        } catch (err) {
          process.stdout.write('Error trying to verify password: ');
          console.log(err);
          return null;
        }
      });
    })
});

export type Router = typeof router;

const NewUserRequest = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string().min(6)
});

export type NewUserRequest = z.infer<typeof NewUserRequest>;

const LogInRequest = z.object({
  email: z.string(),
  password: z.string().min(6)
});

export type LogInRequest = z.infer<typeof LogInRequest>;
