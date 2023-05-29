import { PB_ADMIN, PB_PWD, POCKETBASE_URI } from '$env/static/private';
import { fail, type Actions } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import { z } from 'zod';

export const actions: Actions = {
	join: async ({ request }) => {
		const schema = z.string().min(2);
		const pb = new PocketBase(POCKETBASE_URI);
		await pb.admins.authWithPassword(PB_ADMIN, PB_PWD);
		const formData = await request.formData();

		const { room: unvalidatedRoomID } = Object.fromEntries(formData.entries());
		const result = schema.safeParse(unvalidatedRoomID);
		if (!result.success) {
			return fail(400, { message: 'Too few characters' });
		}
		const roomID = result.data;

		try {
			const filter = `id~"${roomID}"`;
			const record = await pb.collection('rooms').getFirstListItem(filter);

			return { success: true, id: record.id };
		} catch (e) {
			return fail(400, { message: 'Room not found' });
		}
	}
};
