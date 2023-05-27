export const load = async ({ locals, depends }) => {
	depends('user:isAuthenticated');

	return {
		authProviders: locals.authProviders ?? [],
		username:
			locals.pb?.authStore?.baseModel?.username ?? locals.pb?.authStore?.baseModel?.email ?? '',
		id: locals.pb?.authStore?.baseModel?.id ?? ''
	};
};
