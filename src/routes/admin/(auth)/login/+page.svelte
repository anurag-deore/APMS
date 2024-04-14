<!-- src/routes/login/+page.svelte -->
<!-- src/routes/register/+page.svelte -->

<script lang="ts">
	import { goto } from '$app/navigation';

	import { signInWithEmailAndPassword } from 'firebase/auth';
	import { firebaseAuth } from '$lib/firebase';
	import { authUser } from '$lib/authStore';
	let isLoading = false;
	let email: string;
	let password: string;

	let success: boolean | undefined = undefined;
	const login = () => {
		isLoading = true;
		signInWithEmailAndPassword(firebaseAuth, email, password)
			.then((userCredential) => {
				$authUser = {
					user: userCredential.user,
					isAuthenticated: true
				};
				isLoading = true;

				goto('/admin/dashboard');
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;

				success = false;
			});
	};
</script>

<div class="w-full flex flex-col justify-center items-center flex-1 p-5 gap-3">
	<h1 class="text-2xl font-semibold">Login to ALSJ AMS</h1>
	<img src="/login.svg" alt="Login Illustration" class="w-full p-10 md:w-1/4" />
	<form
		class="flex flex-col gap-4 p-3 h-full rounded space-y-4 w-full md:w-1/2"
		on:submit|preventDefault={login}
	>
		<input
			type="email"
			placeholder="Email"
			autocomplete="email"
			class="px-4 py-2 input input-bordered rounded-md"
			required
			disabled={isLoading}
			bind:value={email}
		/>
		<input
			type="password"
			placeholder="Password"
			autocomplete="current-password"
			class="px-4 py-2 input input-bordered rounded-md"
			required
			disabled={isLoading}
			bind:value={password}
		/>

		<button
			type="submit"
			disabled={isLoading}
			class="btn btn-primary flex items-center justify-center gap-3 rounded-md text-white !cursor-not-allowed"
		>
			{#if isLoading}
				<div class="loading loading-dots loading-sm"></div>
			{/if}
			Login
		</button>
	</form>
</div>
