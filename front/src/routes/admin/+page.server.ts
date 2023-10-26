import { SALVA_MAGIC_ID, SALVA_MAGIC_PASS } from '$env/static/private';
import { type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const pass = formData.get('pass') ?? '';
		if (pass === SALVA_MAGIC_PASS) {
			cookies.set('player_id', SALVA_MAGIC_ID, {
				maxAge: 'Session',
				SameSite: 'lax',
				Path: '/',
				httpOnly: true,
				secure: false
			});
			return { success: true };
		} else {
			return {
				success: false
			};
		}
	}
};
export const load: PageServerLoad = async ({ cookies }) => {
	if (cookies.get('player_id') === SALVA_MAGIC_ID) {
		return { loggedIn: true };
	}
};
