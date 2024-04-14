<script>
	import { goto } from '$app/navigation';
	import { authUser } from '$lib/authStore';
	import { redirect } from '@sveltejs/kit';
	import { onMount } from 'svelte';
	import Loader from './Loader.svelte';

	let isLoading = true;

	onMount(() => {
		const unsubscribe = authUser.subscribe((user) => {
			if (user && user.isAuthenticated) {
				goto('/admin/dashboard');
			} else {
				isLoading = false;
			}
		});
		unsubscribe();
		return {};
	});
</script>

{#if isLoading}
	<Loader />
{:else}
	<slot />
{/if}
