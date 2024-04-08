<script lang="ts">
	import Authenticated from '$lib/components/Authenticated.svelte';
	import UnAuthenticated from '$lib/components/UnAuthenticated.svelte';
</script>

<UnAuthenticated>
	<slot />
</UnAuthenticated>
