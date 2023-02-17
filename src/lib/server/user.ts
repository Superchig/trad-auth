import argon2 from 'argon2';
import { sql, type DatabasePool } from 'slonik';
import { schemaId, schemaUuid } from '$lib/server/db';
import type { NewUserRequest } from '$lib/trpc/router';
import type { Role } from '$lib/role';

// NOTE(Chris): This is supposed to be like a model in an MVC app

export const newUser = async (pool: DatabasePool, input: NewUserRequest, role: Role) => {
  // NOTE(Chris): Though we do not input a secret, this will salt and hash
  // the password. Using `argon2.hash()` multiple times on the same input
  // will result in a different output.
  const saltedHashedPass = await argon2.hash(input.password);

  const sessionId = await pool.transaction(async (connection) => {
    const result = await connection.query(
      sql.type(schemaId)`INSERT INTO user_account (username, email, password, role)
                         VALUES (${input.username}, ${input.email}, ${saltedHashedPass}, ${role})
                         RETURNING id;`
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
};
