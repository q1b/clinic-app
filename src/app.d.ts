// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
/// <reference types="svelte-adapter-azure-swa" />
// Do not add any other lines of code to this file!
import "@total-typescript/ts-reset";

declare global {
	namespace App {
		interface Locals {
			auth: import('lucia').AuthRequest;
			session: import('lucia').Session & { access_token: string; refresh_token: string | null } | null;
			user: import('$lib/server/db/schema/index').User | null
		}
	}
}

/// <reference types="lucia" />
declare global {
	namespace Lucia {
		type Auth = import('./lib/server/lucia').Auth;
		type DatabaseUserAttributes = import('$lib/server/db/schema/index').User; // formerly `UserAttributes`
		type DatabaseSessionAttributes = {
			access_token: string
			refresh_token: string | null
		}; // new
		// type DatabaseUserAttributes = {
		// 	github_username: string;
		// };
		// type DatabaseSessionAttributes = Record<string, never>;
	}
}

export { };
