import { redirect, type Actions } from '@sveltejs/kit';
export const actions: Actions = {
	async logout({ locals, cookies }) {
		locals.pb.authStore.clear();
		cookies.set('session', '', {
			path: '/',
			expires: new Date(0),
			secure: process.env.NODE_ENV === 'production'
		});
		throw redirect(302, '/logout');
	}
};
