import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
  return {
    logged: event.locals.session?.id ? true : false,
    user: event.locals.user
  };
};
