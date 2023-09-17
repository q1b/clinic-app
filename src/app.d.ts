// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
/// <reference types="svelte-adapter-azure-swa" />

declare global {
	namespace App {
		interface Locals {
			auth: import('lucia').AuthRequest;
		}
	}
}

/// <reference types="lucia" />
declare global {
	namespace Lucia {
		type Auth = import('./server/lucia').Auth;
		type DatabaseUserAttributes = {
			email?: string;
			image: string;
			name: string;
		}; // formerly `UserAttributes`
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