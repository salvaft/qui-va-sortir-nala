<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	if (browser) {
		setTimeout(() => {
			goto('/', { invalidateAll: true });
		}, 500);
	}
</script>

<h1>Logging out...</h1>
