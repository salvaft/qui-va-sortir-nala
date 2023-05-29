import PocketBase, { type AuthProviderInfo } from 'pocketbase';
import { POCKETBASE_URI } from '$env/static/private';
import { error, redirect, type Handle } from '@sveltejs/kit';

export const handle = (async ({ event, resolve }) => {
	if (!event.locals.pb) {
		event.locals.pb = new PocketBase(POCKETBASE_URI);
	}

	console.log('Hook server running');

	try {
		const res = await event.locals.pb.health.check({});
		if (res.code !== 200) {
			throw error(500, 'Pocketbase health check failed');
		}
	} catch (e) {
		throw error(500, 'Pocketbase failed to connect at all');
	}
	if (process.env.NODE_ENV !== 'production') {
		const user = process.env.PB_TEST;
		const pwd = process.env.PB_TEST_PWD;
		// await event.locals.pb.admins.authWithPassword(user, pwd);
		await event.locals.pb.collection('users').authWithPassword(user, pwd);
		return resolve(event);
	}

	const session = event.cookies.get('session') ?? '';

	if (!session) {
		const methods = await event.locals.pb.collection('users').listAuthMethods();
		const authProviders: AuthProviderInfo[] = methods.authProviders;
		event.locals.authProviders = authProviders;

		if (event.url.pathname.startsWith('/game-ssr')) {
			console.log('No cookie found, redirecting');
			throw redirect(303, '/');
		}
		return resolve(event);
	}

	// load the store data from the request cookie string
	event.locals.pb.authStore.loadFromCookie(session);

	try {
		// get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
		event.locals.pb.authStore.isValid && (await event.locals.pb.collection('users').authRefresh());
	} catch (e) {
		// clear the auth store on failed refresh
		event.locals.pb.authStore.clear();
	}
	return resolve(event);
}) satisfies Handle;
