<script lang="ts">
	import { onDestroy } from 'svelte';
	import { pbStore } from '$lib/store';
	import { gameStore } from '$lib/store';
	import Board from '@components/board.svelte';
	import Movements from '@components/movements.svelte';
	import type { RoomRecord } from '$lib/types';
	import { afterNavigate, goto } from '$app/navigation';
	import Waiter from '@components/waiter.svelte';
	import { confettiAndResetGameStore } from '$lib/utils';
	import GameInfo from '@components/gameInfo.svelte';
	import {
		closeRoom,
		createHandleClickPB,
		createRoom,
		getRoom,
		joinRoom,
		leaveRoom,
		updateGameStoreFromCurrentRoomStatus
	} from '$lib/utils-pb';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { checkWinner } from '$lib/globalUtils';
	let roomID: string | null;
	$: roomID = $page.params.id;
	$gameStore.waiting = true;

	async function play(nextRoom: string) {
		roomID = await getRoom(nextRoom);

		if (!roomID) {
			console.log('Lets create a room');
			roomID = await createRoom();
		}
		if (!roomID) return;

		const joinedRoomID = await joinRoom(roomID);

		if (joinedRoomID) {
			//If joined, update state and subscribe to updates
			await updateGameStoreFromCurrentRoomStatus(joinedRoomID);

			const b = $pbStore
				.collection('rooms')
				.subscribe(joinedRoomID, async function ({ record }: { record: RoomRecord }) {
					console.log('Received broadcast for old room: ', record.comment);
					if (record.next) {
						console.log(
							'Found room.next:',
							record.next,
							'unsubscribing from: ',
							record.id,
							'and starting new game'
						);
						await $pbStore.collection('rooms').unsubscribe(record.id);
						confettiAndResetGameStore(
							$pbStore.authStore.model?.id,
							goto,
							`/game-pb/${record.next}`
						);
						return;
					}
					// Ignore further broadcast once the game store was set to finished. Broadcast can come async and we have code that should be executed only once.
					if ($gameStore.finished) {
						console.log("Game is finished, returning early from broadcast's callback");
						return;
					}

					await updateGameStoreFromCurrentRoomStatus(joinedRoomID);

					if (record.m1 && record.m2) {
						console.log('Entering end of game block');
						const winner = checkWinner({
							m1: record.m1,
							m2: record.m2,
							p1: record.p1,
							p2: record.p2
						});
						$gameStore.winner = winner;
						$gameStore.finished = true;

						// The one who moved last closes the room
						if (record.turn === $pbStore.authStore.model?.id) {
							console.log('Gonna close the current room');

							await closeRoom(record.id, winner);
						} else {
							// The one who didnt move last creates the new room
							console.log('Gonna create the new room');

							const newRoomID = await createRoom();
							if (newRoomID) {
								await $pbStore.collection('rooms').update(record.id, {
									next: newRoomID,
									comment: record.comment + ' ' + `Set next room to ${record.id}.`
								});
								console.log('Set next room to: ', newRoomID);
							}
						}
					}
				});
		}
		return roomID;
	}

	afterNavigate(() => {
		console.log('triggered', roomID);
		if (!$pbStore.authStore.isValid) {
			goto('/', { invalidateAll: true });
		} else {
			if (roomID) play(roomID);
		}
	});

	onDestroy(() => {
		if (roomID) leaveRoom(roomID);
		$pbStore.collection('rooms').unsubscribe();
		gameStore.reset();
	});
</script>

<Board />
<Movements clickHandler={createHandleClickPB(roomID)} />
<Waiter />
<GameInfo />
