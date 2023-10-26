<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onDestroy } from 'svelte';

	export let form;
	let handle: ReturnType<typeof setTimeout>;
	$: {
		if (form?.success === true || $page.data.loggedIn) {
			handle = setTimeout(() => {
				goto('/');
			}, 1000);
		}
	}
	onDestroy(() => {
		if (handle !== undefined) clearTimeout(handle);
	});
</script>

<form action="/admin" method="post" use:enhance>
	<label class="label">
		<span>Input</span>
		<input class="input" type="password" name="pass" id="pass" placeholder="Mot de passe" />
	</label>
</form>
{#if form?.success === false}
	<h3>Bad password</h3>
{/if}
{#if form?.success === true || $page.data.loggedIn}
	<h3>Logged In, Redirecting...</h3>
{/if}
