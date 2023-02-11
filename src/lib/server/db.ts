import { createPool, SchemaValidationError, type Interceptor, type QueryResultRow } from 'slonik';

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

// FIXME(Chris): Make the postgres URL configurable
export const pool = await createPool('postgres://postgres:password@localhost:5432/trad-auth', {
  interceptors: [createResultParserInterceptor()]
});

process.on('exit', async () => {
  await closeDB();
});

async function closeDB() {
  console.log('Ending pool...');

  await pool.end();

  console.log('Pool ending confirmed.');
}
