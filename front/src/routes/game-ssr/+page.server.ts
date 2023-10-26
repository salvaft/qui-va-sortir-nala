import { SALVA_MAGIC_ID } from '$env/static/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	if (cookies.get('player_id') === SALVA_MAGIC_ID) {
		return { isSalva: true };
	}
};
