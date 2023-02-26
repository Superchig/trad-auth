import { closeDB } from '$lib/server/db';
import { describe, it, expect, afterAll } from 'vitest';

describe('sum test', () => {
  it('adds 1 + 2 to equal 3', () => {
    expect(1 + 2).toBe(3);
  });
});

// NOTE(Chris): Thanks to this, we don't have to close the database connection
// after each test.
afterAll(async () => {
	await closeDB();
})