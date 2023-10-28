import { SALVA_MAGIC_ID } from '$env/static/private';
import type { EventType, Move } from '$lib/types.js';

const connectionMap = new Map<string, { ctlr: ReadableStreamDefaultController; move: Move }>();

export const GET = async ({ cookies }) => {
	const playerId = cookies.get('player_id') ?? crypto.randomUUID();

	if (connectionMap.size >= 2) {
		return new Response(JSON.stringify({ error: 'Max players reached' }), { status: 500 });
	}
	const readable = new ReadableStream({
		start(controller) {
			connectionMap.set(playerId, { ctlr: controller, move: '' });

			connectionMap.forEach(({ ctlr }, id) => {
				if (ctlr !== controller) {
					const eventType: EventType = 'meet';
					ctlr.enqueue(`data:${JSON.stringify({ eventType, they: playerId })}\n\n`);
					controller.enqueue(`data:${JSON.stringify({ eventType, they: id })}\n\n`);
				}
			});
			const eventType: EventType = 'join';
			controller.enqueue(`data:${JSON.stringify({ eventType, me: playerId })}\n\n`);
		},
		cancel() {
			connectionMap.forEach(({ ctlr }, id) => {
				if (id !== playerId) {
					const eventType: EventType = 'leave';
					ctlr.enqueue(`data:${JSON.stringify({ eventType, they: playerId })}\n\n`);
				}
			});
			console.log(`Player ${playerId} left`);
			connectionMap.delete(playerId);
		}
	});
	const resp = new Response(readable, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive',
			'Set-Cookie': `player_id=${playerId}; Max-Age=3600; SameSite=strict; Path=/; httpOnly; secure=true`
		}
	});
	return resp;
};

export const POST = async ({ request, cookies }) => {
	const playerId = cookies.get('player_id');
	if (!playerId) {
		console.log('No player id');
		return new Response('{"error":"No player id"}', { status: 400 });
	}
	const player = connectionMap.get(playerId);
	if (!player) {
		return new Response('{"error":"No player found for given id"}', { status: 500 });
	}
	const data = await request.json();
	if (data.move === '') {
		return new Response('{"error":"No move"}', { status: 400 });
	}
	console.log(`Player ${playerId} made move ${data.move}`);
	connectionMap.set(playerId, { ctlr: player.ctlr, move: data.move });

	const salvaCtrl = connectionMap.get(SALVA_MAGIC_ID)?.ctlr;

	if (playerId !== SALVA_MAGIC_ID) {
		salvaCtrl?.enqueue(
			`data:${JSON.stringify({ eventType: 'opponentMove', move: data.move })}\n\n`
		);
	}
	let gameFinished = true;

	for (const value of connectionMap.values()) {
		gameFinished = gameFinished && value.move !== '';
	}
	if (gameFinished) {
		connectionMap.forEach(({ ctlr: controller_one, move: move_one }, player_id) => {
			connectionMap.forEach(({ ctlr: controller_two }) => {
				if (controller_one !== controller_two)
					controller_two.enqueue(
						`data:${JSON.stringify({ eventType: 'opponentMove', move: move_one })}\n\n`
					);
			});
			connectionMap.set(player_id, { ctlr: controller_one, move: '' });
		});
	}
	return new Response(null, { status: 200 });
};
