// socketIOHandler.js
import { Server } from 'socket.io';
import PocketBase from 'pocketbase';
import dotenv from 'dotenv';
import { checkWinner } from './lib/globalUtils.js';

dotenv.config();
/**
 * @param {import ('http').Server } server
 * @returns {void}
 */
export default function injectSocketIO(server) {
	const io = new Server(server);
	let waiting = Date.now() % 2 === 0;

	io.on('connection', async (socket) => {
		const id = socket.handshake.query.id;
		const username = socket.handshake.query.username;

		console.log('New connection', socket.id);
		if (io.engine.clientsCount > 2) {
			socket.disconnect();
			return;
		}
		socket.emit('hello', { waiting });
		socket.broadcast.emit('meet', { id, username });
		waiting = !waiting;
		socket.on(
			'move',
			/**
			 * @param {import ("./lib/types").GameStatus} data
			 */
			async (data) => {
				const pb = new PocketBase(process.env.POCKETBASE_URI);
				const admin = process.env.PB_ADMIN;
				const pwd = process.env.PB_PWD;
				try {
					if (admin && pwd) await pb.admins.authWithPassword(admin, pwd);
				} catch (e) {
					console.log('Error while authenticating with PocketBase');
				}

				if (!pb.authStore.isValid) return;

				const gameStatus = data;

				/**
				 * @type {import ("./lib/types").RecordSSR}
				 */
				let record;

				try {
					if (!gameStatus.partida) {
						record = await pb
							.collection('partidas')
							.create({ m1: gameStatus.move, p1: gameStatus.me });
						console.log('SocketIOHandler: Creating', record.id);
					} else {
						const { m1, p1 } = await pb.collection('partidas').getOne(gameStatus.partida);

						const p2 = gameStatus.me;
						const m2 = gameStatus.move;

						let winner = null;
						if (m1 !== '' && m2 !== '') winner = checkWinner({ p1, p2, m1, m2 });
						record = await pb
							.collection('partidas')
							.update(gameStatus.partida, { m2: gameStatus.move, p2, finished: true, winner });
						console.log('SocketIOHandler: Updating', record.id);
						console.log(record);
					}
					socket.emit('move', record);
					socket.broadcast.emit('move', record);
				} catch (e) {
					console.log('Error while updating the DB. Check pocketbase permissions');
				}
			}
		);
		socket.on('disconnect', () => {
			console.log('Disconnecting', socket.id);
			socket.broadcast.emit('leave', { id, username });
		});
		socket.on('meet', ({ id }) => {
			socket.broadcast.emit('meet', { id, username });
		});
		socket.on('meetBack', ({ id }) => {
			socket.broadcast.emit('meetBack', { id, username });
		});
	});

	console.log('SocketIO injected');
}
