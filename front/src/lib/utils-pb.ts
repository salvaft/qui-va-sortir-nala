import type { Move, RoomRecord } from './types';
import { gameStore, pbStore } from './store';
import PocketBase from 'pocketbase';

const getPbFromStore = () => {
	let pb: PocketBase = new PocketBase();
	pbStore.subscribe((state) => {
		pb = state;
		if (!pb.health.check({})) return null;
	});
	return pb;
};

export const updateGameStoreFromCurrentRoomStatus = async (id: string) => {
	const pb = getPbFromStore();
	const record = await getCurrentStatusFromDB(id);
	if (!record) return;
	gameStore.update((state) => {
		state.finished = record.finished;
		state.partida = record.id;

		if (record.p1 === pb.authStore.model?.id) {
			state.me = record.p1;
			state.they = record.p2;
			state.m1 = record.m1;
			state.m2 = record.m2;
		} else if (record.p2 === pb.authStore.model?.id) {
			state.me = record.p2;
			state.they = record.p1;
			state.m2 = record.m1;
			state.m1 = record.m2;
		}
		state.myUsername = record.expand?.p2?.username ?? state.myUsername;
		state.theirUsername = record.expand?.p1?.username ?? state.theirUsername;
		state.waiting = !(pb.authStore.model?.id === record.turn);

		return state;
	});
};

async function getCurrentStatusFromDB(id: string) {
	const pb = getPbFromStore();
	try {
		const record: RoomRecord = await pb.collection('rooms').getOne(id, {
			expand: 'p1,p2'
		});

		return record;
	} catch (error) {
		console.warn('Problem getting current status from DB');
		return null;
	}
}
export async function closeRoom(id: string, winner: string | null) {
	console.log('Closing room', id);
	const pb = getPbFromStore();
	const roomCurrentStatus = await getCurrentStatusFromDB(id);
	if (!roomCurrentStatus) return null;
	try {
		const record: RoomRecord = await pb.collection('rooms').update(id, {
			finished: true,
			winner,
			comment: roomCurrentStatus.comment + ' ' + 'Closed room.'
		});
		return record;
	} catch (error) {
		console.warn('Problem closing the room');
		return null;
	}
}

export async function leaveRoom(id: string) {
	const pb = getPbFromStore();
	const roomCurrentStatus = await getCurrentStatusFromDB(id);
	if (!roomCurrentStatus || roomCurrentStatus.finished) return null;

	let seat = '';
	if (roomCurrentStatus.p1 === pb.authStore.model?.id) seat = 'p1';
	else if (roomCurrentStatus.p2 === pb.authStore.model?.id) seat = 'p2';
	else return null;

	let turn: string | null = roomCurrentStatus.turn;
	if (roomCurrentStatus.turn === pb.authStore.model?.id) {
		turn = null;
	}
	try {
		console.log('Leaving room', roomCurrentStatus.id);
		const record: RoomRecord = await pb
			.collection('rooms')
			.update(roomCurrentStatus.id, { free: true, [seat]: null, turn });
		return record.id;
	} catch (error) {
		console.warn('Problem leaving the room');
		return null;
	}
}
export async function getRoom(id: string) {
	const pb = getPbFromStore();

	try {
		const record: RoomRecord = await pb.collection('rooms').getOne(`${id}`);
		console.log('Found	 room', record.id);
		if (record.finished === true) {
			console.log('Room is finished');
			return null;
		}
		return record.id;
	} catch (error) {
		console.warn(`No next room found with id ${id} or problem getting it.`);
		return null;
	}
}
export async function joinRoom(id: string) {
	const pb = getPbFromStore();
	const roomCurrentStatus = await getCurrentStatusFromDB(id);
	if (!roomCurrentStatus) return null;

	if (
		roomCurrentStatus.p1 === pb.authStore.model?.id ||
		roomCurrentStatus.p2 === pb.authStore.model?.id
	) {
		console.warn('You already have a seat assigned in this room');
		return roomCurrentStatus.id;
	}
	const seat = !roomCurrentStatus.p1 ? 'p1' : !roomCurrentStatus.p2 ? 'p2' : null;

	if (seat === null) {
		console.warn('Room is full');
		return null;
	}

	const free = (roomCurrentStatus.p1 || roomCurrentStatus.p2) && seat ? false : true;
	let turn = roomCurrentStatus.turn;
	if (
		!roomCurrentStatus.turn ||
		(roomCurrentStatus.p1 !== roomCurrentStatus.turn &&
			roomCurrentStatus.p2 !== roomCurrentStatus.turn)
	) {
		turn = pb.authStore.model?.id as string;
	}
	console.log('Joining', roomCurrentStatus.id, 'sitting', seat, 'turn', turn);

	try {
		const record: RoomRecord = await pb.collection('rooms').update(roomCurrentStatus.id, {
			free,
			[seat]: pb.authStore.model?.id,
			turn,
			comment: roomCurrentStatus.comment + ' ' + `${pb.authStore.model?.id} joined room.`
		});
		return record.id;
	} catch (error) {
		console.warn('Problem joining the room.');
		return null;
	}
}

export async function createRoom() {
	const pb = getPbFromStore();

	try {
		const room: RoomRecord = await pb.collection('rooms').create({
			free: true,
			turn: pb.authStore.model?.id,
			p1: pb.authStore.model?.id,
			comment: 'Created room.'
		});
		console.log('Created room:', room.id);
		return room.id;
	} catch (error) {
		console.warn('Error creating the room');
		return null;
	}
}

export function createHandleClickPB(id: string | null) {
	if (!id) {
		console.log('Click handler creation failed because room is: ', id);
		return null;
	} else {
		const move = async (m: Move) => {
			const pb = getPbFromStore();
			const roomCurrentStatus = await getCurrentStatusFromDB(id);
			if (!roomCurrentStatus) return null;

			let turn = '';
			if (roomCurrentStatus.turn !== pb.authStore.model?.id) {
				console.warn(
					'Not your turn',
					'you are: ',
					pb.authStore.model?.id,
					'and the turn is',
					roomCurrentStatus.turn
				);
				return null;
			} else {
				turn =
					roomCurrentStatus.p1 === roomCurrentStatus.turn
						? roomCurrentStatus.p2
						: roomCurrentStatus.p1;
			}
			let seat = '';
			if (roomCurrentStatus.p1 === pb.authStore.model?.id) {
				seat = 'm1';
			} else if (roomCurrentStatus.p2 === pb.authStore.model?.id) seat = 'm2';

			try {
				const record = await pb
					.collection('rooms')
					.update(roomCurrentStatus.id, { [seat]: m, turn });
				return record;
			} catch (error) {
				console.warn('Problem making the move');
			}
		};
		return move;
	}
}
