<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { flowStore } from '$lib/store';
	import { Flow } from '$lib/consts';
	import { PUBLIC_REDIRECT_URI } from '$env/static/public';
	import { pbStore } from '$lib/store';

	let res: Promise<Response>;
	let code = '';
	let state = '';

	if (browser) {
		const provider = JSON.parse(localStorage.getItem('provider') ?? '{}');
		code = $page.url.searchParams.get('code') ?? '';
		state = $page.url.searchParams.get('state') ?? '';

		const body = JSON.stringify({ provider, code, state });

		if ($flowStore === Flow.ssr) {
			res = fetch($page.url.origin + $page.url.pathname, {
				method: 'POST',
				body
			});
			res.then((res) => {
				if (res.ok) {
					setTimeout(() => {
						goto('/', { invalidateAll: true });
					}, 500);
				}
			});
		} else if ($flowStore === Flow.pb) {
			$pbStore
				.collection('users')
				.authWithOAuth2Code(provider.name, code, provider.codeVerifier, PUBLIC_REDIRECT_URI)
				.then(() => {
					setTimeout(() => {
						goto('/', { invalidateAll: true });
					}, 500);
				});
		}
	}
</script>

<h1>
	<h3>
		code:
		{code || 'No code found'}
	</h3>
	<h3>
		state:
		{state || 'No state found'}
	</h3>
</h1>
<div>
	{#if res}
		{#await res}
			<h1>Authenticating...</h1>
		{:then res}
			<h2>Res OK: {res.ok}</h2>
			<h2>Status: {res.statusText}</h2>
			{#if res.ok}
				<h3>Redirecting...</h3>
			{:else}
				<h4>There was a problem:</h4>
				{#if $page.url.searchParams.has('error')}
					<h4>{$page.url.searchParams.get('error')}</h4>
				{/if}
				<a href="/">Return</a>
			{/if}
		{:catch e}
			<p>{e}</p>
		{/await}
	{/if}
</div>
