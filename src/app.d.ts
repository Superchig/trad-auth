// See https://kit.svelte.dev/docs/types#app

import type { UserInfo } from "$lib/server/user_info";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: UserInfo | undefined;
		}
		interface PageData {
			user: UserInfo | undefined;
		}
		// interface Platform {}
	}
}

export {};
