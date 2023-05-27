<script lang="ts">
	import { page } from '$app/stores';
	import { PUBLIC_REDIRECT_URI, PUBLIC_POCKETBASE_URI } from '$env/static/public';
	import { Flow } from '$lib/consts';
	import { pbStore, socketStore, flowStore } from '$lib/store';
	import type { AuthProviderInfo } from 'pocketbase';
	import { onMount } from 'svelte';
	$: username = $flowStore === Flow.ssr ? $page.data.username : $pbStore.authStore.model?.username;

	let pbClientAuthProviders: AuthProviderInfo[] = [];

	async function getpbClientAuthProviders() {
		const providers = (await $pbStore.collection('users').listAuthMethods()).authProviders;
		return providers;
	}
	onMount(() => {
		getpbClientAuthProviders()
			.then((providers) => {
				pbClientAuthProviders = providers;
			})
			.catch(() => {
				console.log('Check PB is serving to LAN and not only to localhost');
			});
	});
	$: providers = $flowStore === Flow.ssr ? $page.data.authProviders : pbClientAuthProviders;
</script>

<nav class:justify-end={$socketStore === ''} class:justify-between={$socketStore !== ''}>
	{#if $socketStore !== ''}
		<span class="badge variant-filled">{$socketStore}</span>
	{/if}

	<div role="group" class="flex justify-end gap-4 items-center">
		<a class="btn variant-ghost-surface" href={'/'}><span>Home</span></a>
		{#if username}
			<form action="/logout?/logout" method="post" class="flex items-center gap-4">
				<span class="badge variant-filled">{username}</span>
				<button
					type="submit"
					class="btn variant-ghost-surface flex-col"
					on:click={() => {
						localStorage.removeItem('pocketbase_auth');
					}}
					>Logout
				</button>
			</form>
		{:else}
			{#each providers as provider}
				<a
					class="btn variant-ghost-surface"
					href={provider.authUrl + PUBLIC_REDIRECT_URI}
					on:click={() => {
						localStorage.setItem('provider', JSON.stringify(provider));
					}}
				>
					<span
						><svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
							/>
						</svg>
					</span>
					<span>{provider.name}</span>
				</a>
			{/each}
		{/if}
	</div>
</nav>

<style>
	nav {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		align-items: center;
	}
</style>
