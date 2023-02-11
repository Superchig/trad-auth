import { createPool } from 'slonik';

// FIXME(Chris): Make the postgres URL configurable
export const pool = await createPool('postgres://postgres:password@localhost:5432/trad-auth');

export function get_query(): number {
  return 5;
}

process.on('exit', async () => {
  await closeDB();
});

async function closeDB() {
  console.log('Ending pool...');

  await pool.end();

  console.log('Pool ending confirmed.');
}