// See https://kit.svelte.dev/docs/types#app

import type { AuthProviderInfo } from 'pocketbase';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			pb: PocketBase;
			provider: AuthProviderInfo;
			authProviders: AuthProviderInfo[];
		}
		// interface PageData {}
		// interface Platform {}
	}
}
export {};
