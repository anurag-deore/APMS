<!-- src/routes/login/+page.svelte -->
<!-- src/routes/register/+page.svelte -->

<script lang="ts">
	import { goto } from '$app/navigation';

	import { signInWithEmailAndPassword } from 'firebase/auth';
	import { firebaseAuth } from '$lib/firebase';
	import { authUser } from '$lib/authStore';

	let email: string;
	let password: string;

	let success: boolean | undefined = undefined;
	const login = () => {
		signInWithEmailAndPassword(firebaseAuth, email, password)
			.then((userCredential) => {
				$authUser = {
					user: userCredential.user,
					isAuthenticated: true
				};

				goto('/admin/dashboard');
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;

				success = false;
			});
	};
</script>

<form
	class="flex flex-col gap-4 p-8 space-y-4 bg-white sm:w-10/12"
	on:submit|preventDefault={login}
>
	<input
		type="email"
		placeholder="Email"
		autocomplete="email"
		class="px-4 py-2 border border-gray-300 rounded-md"
		required
		bind:value={email}
	/>
	<input
		type="password"
		placeholder="Password"
		autocomplete="current-password"
		class="px-4 py-2 border border-gray-300 rounded-md"
		required
		bind:value={password}
	/>

	<button type="submit" class="default-action">Login</button>
</form>
