import { z } from 'zod';
import { sql } from 'slonik';
import { getPool } from '$lib/server/db';
import argon2 from 'argon2';
import { accountRouter } from '$lib/trpc/routers/account';
import { router, publicProcedure } from './router';

export const appRouter = router({
  logIn: publicProcedure
    .input((val: unknown) => {
      return LogInRequest.parse(val);
    })
    .query(async ({ input }) => {
      const pool = await getPool();
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
          if (result !== undefined && (await argon2.verify(result.password, input.password))) {
            return result.id; // Session ID
          } else {
            return null;
          }
        } catch (err) {
          process.stdout.write('Error trying to verify password: ');
          console.log(err);
          return null;
        }
      });
    }),
  account: accountRouter
});

export type Router = typeof appRouter;

export const NewUserRequest = z.object({
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
