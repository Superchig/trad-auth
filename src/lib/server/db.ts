import {
  createPool,
  SchemaValidationError,
  type DatabasePool,
  type Interceptor,
  type QueryResultRow
} from 'slonik';

import { DATABASE_URL } from '$env/static/private';

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
    return await createPool(DATABASE_URL, {
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

export const pool = await makePool();

process.on('exit', async () => {
  await closeDB();
});

async function closeDB() {
  console.log('Ending pool...');

  await pool.end();

  console.log('Pool ending confirmed.');
}
