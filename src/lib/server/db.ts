import { createPool } from 'slonik';

// FIXME(Chris): Make the postgres URL configurable
export const pool = await createPool('postgres://postgres:password@localhost:5432/trad-auth');

export function get_query(): number {
  return 5;
}

process.on('exit', async (code) => {
  await closeDB();
});

process.on('SIGINT', () => {
  process.exit();
});

async function closeDB() {
  if (pool == null) {
    return;
  }

  await pool.end();

  console.log('Database closed.');
}