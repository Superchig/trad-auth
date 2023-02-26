import {
  createPool,
  SchemaValidationError,
  type DatabasePool,
  type Interceptor,
  type QueryResultRow
} from 'slonik';

import { env } from '$env/dynamic/private';
import { z } from 'zod';

// NOTE(Chris): This is modified slightly to get it to type-check
// https://github.com/gajus/slonik/tree/v33.0.7#result-parser-interceptor
const createResultParserInterceptor = (): Interceptor => {
  return {
    transformRow: (executionContext, actualQuery, row: any) => {
      const { log, resultParser } = executionContext;

      if (!resultParser) {
        return row;
      }

      const validationResult = resultParser.safeParse(row);

      if (!validationResult.success) {
        throw new SchemaValidationError(actualQuery, row, validationResult.error.issues);
      }

      return validationResult.data as QueryResultRow;
    }
  };
};

const makePool = async (): Promise<DatabasePool> => {
  try {
    return await createPool(env.DATABASE_URL, {
      interceptors: [createResultParserInterceptor()]
    });
  } catch (err) {
    process.stdout.write('Database pool creation error: ');
    console.log(err);
    throw new Error(
      'An error occurred while creating the database pool. Check (console) logs for more detail.'
    );
  }
};

let pool: DatabasePool | null = null;

export const getPool = async () => {
  if (pool === null) {
    pool = await makePool();
  }

  return pool;
}

process.on('exit', async () => {
  await closeDB();
});

export async function closeDB() {
  if (pool !== null) {
    await pool.end();
    pool = null;
  }
}

export const schemaId = z.object({
  id: z.number()
});
export const schemaVoid = z.object({
  void: z.object({}).strict()
});
export const schemaUuid = z.object({
  id: z.string().uuid()
});