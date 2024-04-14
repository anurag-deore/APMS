<script lang="ts">
	import { goto } from '$app/navigation';
	import HomeIcon from '$lib/assets/HomeIcon.svelte';

	let token = '';

	let tokenError = '';

	const handleChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		token = target.value;
		tokenError = '';
	};

	const handleSubmit = async (event: Event) => {
		event.preventDefault();
		if (!token.trim()) {
			tokenError = 'Token is required';
			return;
		} else if (token.trim().length < 5) {
			tokenError = 'Token must be at least 5 characters';
			return;
		}

		// Redirect to token/[document-id] page on successful submission
		goto(`/token/${token}`);
	};
</script>

<div class="min-h-screen w-full border border-black">
	<header
		class="bg-white flex justify-between items-center w-full px-5 py-3 border-b"
	>
		<a
			href="/"
			class="flex w-10 h-10 bg-gray-50 p-2 border border-gray-400 rounded-xl"
		>
			<HomeIcon />
		</a>
	</header>
	<h3 class="text-2xl font-semibold px-5 py-3">Check Status</h3>

	<form
		class=" bg-white h-full flex flex-col p-5"
		on:submit|preventDefault={handleSubmit}
	>
		<label for="token">Enter your token number:</label>
		<br />
		<input
			type="text"
			id="token"
			name="token"
			on:input={handleChange}
			class="input input-bordered rounded-xl w-full"
			class:input-error={tokenError}
			placeholder="Eg. ABC123"
			bind:value={token}
		/>
		{#if tokenError}
			<div class="label">
				<span class="label-text-alt text-red-500">{tokenError}</span>
			</div>
		{/if}
		<button
			type="submit"
			class="btn btn-active rounded-xl btn-primary text-white font-normal text-lg w-full md:w-fit mt-3"
		>
			Check
		</button>
	</form>
</div>
