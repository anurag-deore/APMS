<script lang="ts">
	import { page } from '$app/stores';
	import Err404Icon from '$lib/assets/Err404Icon.svelte';
	import ErrorIcon from '$lib/assets/ErrorIcon.svelte';
</script>

<div class="h-screen flex flex-col gap-4 justify-center items-center">
	<div class="w-[80%]">
		{#if $page.status === 404}
			<Err404Icon />
		{:else}
			<ErrorIcon />
		{/if}
	</div>
	<h1 class="p-3 border border-gray-300 rounded bg-gray-100">
		{$page.error?.message}
	</h1>
</div>
