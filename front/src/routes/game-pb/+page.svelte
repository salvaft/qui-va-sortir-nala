<script lang="ts">
	import { onMount } from 'svelte';
	import { pbStore } from '$lib/store';
	import { gameStore } from '$lib/store';
	import { goto } from '$app/navigation';
	import { createRoom } from '$lib/utils-pb';
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';

	let roomID: string | null = '';
	export let form: ActionData;

	onMount(() => {
		if (!$pbStore.authStore.isValid) {
			setTimeout(() => {
				goto('/', { invalidateAll: true });
			}, 500);
		}
	});
</script>

{#if !$pbStore.authStore.isValid}
	<h1>Login to play. You are being redirected...</h1>
{:else if !roomID}
	<form method="POST" action="?/join" class="grid grid-cols-1 gap-4" use:enhance>
		<label class="label">
			<span>Room Id</span>
			<input
				value={form?.id ?? ''}
				class="input placeholder:text-center text-center"
				type="text"
				name="room"
				id="room"
				placeholder="Leave empty to create a new room"
			/>
		</label>
		<div class="flex justify-between gap-2">
			<button type="submit" class="btn variant-ringed-secondary">Search Room</button>
			<button
				type="button"
				class="btn variant-ringed-secondary flex"
				on:click={async () => {
					let id;
					if (!form?.id) {
						id = await createRoom();
					} else {
						id = form?.id;
					}
					if (id) goto(`/game-pb/${id}`);
				}}>Join/Create Room</button
			>
		</div>
	</form>
	{#if form?.message}
		<span class="badge variant-soft-error">{form?.message}</span>
	{/if}
{/if}
