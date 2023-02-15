import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  process.stdout.write('locals: ');
  console.log(locals);
  return {
    user: locals.user
  };
};
