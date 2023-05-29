import { error, type RequestHandler } from '@sveltejs/kit';
import { PUBLIC_REDIRECT_URI } from '$env/static/public';

export const POST = (async ({ request, locals, cookies }) => {
	const { provider, code, state } = await request.json();

	if (provider.state !== state) {
		throw error(400, {
			message: "State parameters don't match."
		});
	}

	try {
		await locals.pb
			.collection('users')
			.authWithOAuth2Code(provider.name, code, provider.codeVerifier, PUBLIC_REDIRECT_URI);

		cookies.set('session', locals.pb.authStore.exportToCookie(), {
			// send cookie for every page
			path: '/',
			// only sent over HTTPS in production
			secure: process.env.NODE_ENV === 'production'
			// only requests from same site can send cookies
			// 	// https://developer.mozilla.org/en-US/docs/Glossary/CSRF
			// sameSite: 'strict',
			// server side only cookie so you can't use `document.cookie`
			// httpOnly: true
		});

		// cookies.set('session', locals.pb.authStore.token, {
		// 	// send cookie for every page
		// 	path: '/',
		// 	// server side only cookie so you can't use `document.cookie`
		// 	httpOnly: true,
		// 	// only requests from same site can send cookies
		// 	// https://developer.mozilla.org/en-US/docs/Glossary/CSRF
		// 	sameSite: 'strict',
		// 	// only sent over HTTPS in production
		// 	secure: process.env.NODE_ENV === 'production',
		// 	// set cookie to expire after a month
		// 	maxAge: 60 * 60 * 24 * 30
		// });
	} catch (e: unknown) {
		throw error(400, 'Error handling auth');
	}

	return new Response('OK', { status: 200 });
}) satisfies RequestHandler;
