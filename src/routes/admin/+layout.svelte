<script lang="ts">
	import { getAuth } from 'firebase/auth';
	import type { Unsubscribe } from 'firebase/auth';
	import { authUser } from '$lib/authStore';
	import { onDestroy, onMount } from 'svelte';
	import Loader from '$lib/components/Loader.svelte';

	let loading: boolean = true;
	let unsubscribe: Unsubscribe | undefined;

	function cleanup() {
		if (unsubscribe) {
			unsubscribe();
		}
	}

	onMount(() => {
		const auth = getAuth();
		unsubscribe = auth.onAuthStateChanged((user) => {
			if (user) {
				$authUser = {
					user: user,
					isAuthenticated: true
				};
			} else {
				$authUser = {
					user: null,
					isAuthenticated: false
				};
			}
			loading = false;
		});
	});

	onDestroy(cleanup);
</script>

{#if loading}
	<Loader />
{:else}
	<slot />
{/if}
