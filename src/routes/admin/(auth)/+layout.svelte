<script lang="ts">
	import Authenticated from '$lib/components/Authenticated.svelte';
</script>

<Authenticated>
	<div class="h-screen flex items-center bg-white">
		<slot />
	</div>
</Authenticated>
