<script>
	import { goto } from '$app/navigation';
	import { authUser } from '$lib/authStore';
	import { onMount } from 'svelte';
	let isLoading = true;

	onMount(() => {
		const unsubscribe = authUser.subscribe((user) => {
			if (!user || !user.isAuthenticated) {
				goto('/admin/login');
			} else {
				isLoading = false;
			}
		});
		unsubscribe();
		return {};
	});
</script>

{#if !isLoading}
	<slot />
{/if}
