<script lang="ts">
	import UnAuthenticated from '$lib/components/UnAuthenticated.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { getAuth, signOut } from 'firebase/auth';
	import type { Unsubscribe } from 'firebase/auth';
	import { firebaseAuth } from '$lib/firebase';
	import { authUser } from '$lib/authStore';
	import { onDestroy, onMount } from 'svelte';
	import Hamburger from '$lib/assets/Hamburger.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import Button from '$lib/components/Button.svelte';
	import AllList from '$lib/assets/AllList.svelte';
	import IconButton from '$lib/components/IconButton.svelte';
	import SettingsIcon from '$lib/assets/SettingsIcon.svelte';
	import ExportIcon from '$lib/assets/ExportIcon.svelte';
	import LogoutIcon from '$lib/assets/LogoutIcon.svelte';

	let loading: boolean = true;

	let drawerOpen = false;

	const handleLogout = () => {
		signOut(firebaseAuth)
			.then(() => {
				$authUser = {
					user: null,
					isAuthenticated: false
				};
				drawerOpen = false;
				goto('/admin/login');
			})
			.catch((error) => {
				console.log(error);
			});
	};
	let unsubscribe: Unsubscribe | undefined;

	function cleanup() {
		if (unsubscribe) {
			unsubscribe();
		}
	}

	const navigateTo = (link: string) => {
		if (drawerOpen) {
			drawerOpen = false;
		}
		goto(link);
	};

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

<UnAuthenticated>
	{#if loading}
		<Loader />
	{:else}
		<div class="drawer">
			<input
				id="my-drawer-3"
				type="checkbox"
				class="drawer-toggle"
				bind:checked={drawerOpen}
			/>
			<div class="drawer-content flex flex-col overflow-hidden h-screen">
				<!-- Navbar -->
				<nav class="flex w-full navbar border-b bg-">
					<div class="flex-1 grow text-lg px-2 mx-2">ALSJ AMS</div>
					<div class="flex-none hidden lg:block">
						<ul class="menu menu-horizontal">
							<li><a href="/admin/dashboard">Home</a></li>
							<li><a href="/admin/settings">Settings</a></li>
							<li><a href="/admin/export">Export</a></li>
							<li>
								<IconButton
									icon={LogoutIcon}
									className="!w-fit border-none rounded-sm"
									onClick={handleLogout}
									disabled={false}
									title={'Logout'}
								/>
							</li>
						</ul>
					</div>
					<div class="flex-none w-min lg:hidden">
						<label
							for="my-drawer-3"
							aria-label="open sidebar"
							class="btn bg-transparent w-16 rounded-md border-none shadow-none p-3"
						>
							<Hamburger />
						</label>
					</div>
				</nav>
				<slot />
			</div>
			<div class="drawer-side">
				<label
					for="my-drawer-3"
					aria-label="close sidebar"
					class="drawer-overlay"
				></label>
				<ul class="menu menu-lg p-4 w-80 min-h-full bg-white gap-3">
					<!-- Sidebar content here -->
					<li>
						<IconButton
							icon={AllList}
							title="All Appointments"
							className="!w-full !text-base"
							onClick={() => navigateTo('/admin/dashboard')}
							disabled={false}
						/>
					</li>
					<li>
						<IconButton
							icon={SettingsIcon}
							title="Settings"
							className="!w-full !text-base"
							onClick={() => navigateTo('/admin/settings')}
							disabled={false}
						/>
					</li>
					<li>
						<IconButton
							icon={ExportIcon}
							title="Export Data"
							className="!w-full !text-base"
							onClick={() => navigateTo('/admin/export')}
							disabled={false}
						/>
					</li>
					<li>
						<IconButton
							icon={LogoutIcon}
							title="Logout"
							className="!w-full !text-base"
							onClick={handleLogout}
							disabled={false}
						/>
					</li>
				</ul>
			</div>
		</div>
	{/if}
</UnAuthenticated>
