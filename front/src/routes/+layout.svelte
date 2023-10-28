<script>
	import Navigation from '@components/navigation.svelte';
	import Header from '@components/header.svelte';
	// Your selected Skeleton theme:
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	// This contains the bulk of Skeletons required styles:
	import '@skeletonlabs/skeleton/styles/all.css';
	// Finally, your application's global stylesheet (sometimes labeled 'app.css')
	import '../app.postcss';
	import { Toast } from '@skeletonlabs/skeleton';
</script>

<Toast />
<svelte:head
	><link rel="apple-touch-icon" href="/apple-touch-icon.png" />
	<link rel="apple-touch-icon" sizes="48x48" href="/apple-touch-icon-48-48.png" />
	<link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72-72.png" />
	<link rel="apple-touch-icon" sizes="96x96" href="/apple-touch-icon-96-96.png" />
	<link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144-144.png" />
	<link rel="apple-touch-icon" sizes="192x192" href="/apple-touch-icon-192-192.png" />
	<link rel="apple-touch-icon" sizes="256x256" href="/apple-touch-icon-256-256.png" />
	<link rel="apple-touch-icon" sizes="384x384" href="/apple-touch-icon-384-384.png" />
	<link rel="apple-touch-icon" sizes="512x512" href="/apple-touch-icon-512-512.png" /></svelte:head
>
<Navigation />
<Header />
<main>
	<slot />
</main>

<style>
	main {
		display: grid;
		place-content: center;
		gap: 1rem;
		padding: 1rem;

		grid-template-columns: 1;
		@media screen and (min-width: 768px) {
			padding: 0rem;
		}
	}
</style>
