// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
		interface Locals {
			auth: import('lucia').AuthRequest | null;
			session: import('lucia').Session | null;
		}
	}
}

/// <reference types="lucia" />
declare global {
	namespace Lucia {
		type Auth = import('./lib/server/lucia').Auth;
		type DatabaseUserAttributes = import('$lib/shared/db/schema/index').User; // formerly `UserAttributes`
		type DatabaseSessionAttributes = {}; // new
		// type DatabaseUserAttributes = {
		// 	github_username: string;
		// };
		// type DatabaseSessionAttributes = Record<string, never>;
	}
}

export { };
// using neovimjk
