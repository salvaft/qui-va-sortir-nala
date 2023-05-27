import type { RecordSSR, GameStatus } from '$lib/types';
import { checkWinner } from '$lib/globalUtils';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
	if (!locals.session) {
		return new Response('Login to play', { status: 401 });
	}

	const { move, partida }: GameStatus = await request.json();

	let record: RecordSSR;

	try {
		if (!partida) {
			record = await locals.pb
				.collection('partidas')
				.create({ m1: move, p1: locals.pb.authStore.baseModel.id });
			console.log('creating', record.id);
		} else {
			const { m1, p1 } = await locals.pb.collection('partidas').getOne(partida);

			const p2 = locals.pb.authStore.baseModel.id;
			const m2 = move;

			let winner = null;
			if (m1 !== '' && m2 !== '') winner = checkWinner({ p1, p2, m1, m2 });
			record = await locals.pb
				.collection('partidas')
				.update(partida, { m2: move, p2, finished: true, winner });
		}
	} catch (e) {
		return new Response('Error while updating the DB. Check pocketbase permissions', {
			status: 400
		});
	}

	return new Response(JSON.stringify(record), { status: 200 });
};
