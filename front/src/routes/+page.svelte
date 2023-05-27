<script lang="ts">
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import { flowStore } from '$lib/store';
	import { Flow } from '$lib/consts';
	import { onMount } from 'svelte';
	import type { IFlow } from '$lib/types';
	let flow: IFlow | null = null;
	let href: string = '';
	import { page } from '$app/stores';

	onMount(() => {
		flow = (localStorage.getItem('flow') as IFlow) ?? 'ssr';
	});

	$: if (flow === 'ssr') {
		flowStore.set(Flow.ssr);
		href = '/game-ssr';
	} else if (flow === 'pb') {
		flowStore.set(Flow.pb);
		href = '/game-pb';
	}
</script>

<div class="flex mx-auto">
	<RadioGroup active="variant-filled-primary" hover="hover:variant-soft-primary">
		<RadioItem bind:group={flow} name="time" value={'ssr'}>SSR</RadioItem>
		<RadioItem bind:group={flow} name="time" value={'pb'}>Pb</RadioItem>
	</RadioGroup>
</div>

<a {href} class="btn variant-filled-primary mx-auto">Play</a>
{#if !$page.data.id && $flowStore === Flow.ssr}
	<aside class="flex alert variant-filled-warning flex-row items-center">
		<!-- Icon -->
		<div class="variant-filled-warning">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-10 h-10"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
				/>
			</svg>
		</div>
		<!-- Message -->
		<div class="alert-message variant-filled-warning my-auto">
			<h3>Login to play</h3>
			<p>Please login with Github</p>
		</div>
		<!-- Actions -->
	</aside>
{/if}
