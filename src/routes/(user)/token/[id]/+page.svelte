<script lang="ts">
	import CheckIcon from '$lib/assets/CheckIcon.svelte';
	import HomeIcon from '$lib/assets/HomeIcon.svelte';
	import WaitingIcon from '$lib/assets/WaitingIcon.svelte';
	import { STATUS } from '$lib/constants';
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';
	import { load } from './+page';
	import { invalidate } from '$app/navigation';
	import { comment } from 'postcss';
	import CancelIcon from '$lib/assets/CancelIcon.svelte';

	export let data: PageData;
	let pollingInterval: NodeJS.Timeout | undefined;
	const handleRefresh = () => {
		window.location.reload();
	};

	onMount(() => {
		pollingInterval = setInterval(() => {
			if (data.status === STATUS.APPROVED || data.status === STATUS.REJECTED)
				return;
			fetchData(); // Call the function to fetch updated data
		}, 5000); // 15 seconds in milliseconds
	});

	onDestroy(() => {
		if (pollingInterval) {
			clearInterval(pollingInterval);
		}
	});

	async function fetchData() {
		invalidate('app:loadToken');
	}

	const statusMap = {
		[STATUS.PENDING]: {
			text: 'text-blue-600',
			bg: 'bg-blue-100',
			secondaryBg: 'bg-blue-900',
			message: 'Awaiting Approval',
			subText: 'Your request has been submitted. Please wait for approval.',
			icon: WaitingIcon
		},
		[STATUS.APPROVED]: {
			text: 'text-green-600',
			bg: 'bg-green-100',
			secondaryBg: 'bg-green-800',
			message: 'Request Approved',
			subText: 'Your request has been approved. Kindly proceed to the office.',
			icon: CheckIcon
		},
		[STATUS.REJECTED]: {
			text: 'text-red-600',
			bg: 'bg-red-100',
			secondaryBg: 'bg-red-900',
			message: 'Request Declined',
			subText: 'Your request has been declined. Reason mentioned below.',
			icon: CancelIcon
		}
	};
</script>

<div class="min-h-screen flex flex-col">
	<header
		class="bg-white flex justify-between items-center shadow-xl w-full px-5 py-3 border-b"
	>
		<a
			href="/"
			class="flex w-10 h-10 bg-gray-50 p-2 border border-gray-400 rounded-xl"
		>
			<HomeIcon />
		</a>
		{#if data.status === STATUS.PENDING}
			<button
				on:click={handleRefresh}
				class="border border-gray-400 p-2 rounded-xl bg-gray-50 flex items-center justify-center gap-2 text-sm active:scale-95 focus:scale-95 transition-all"
			>
				<span class="h-5 w-5">
					<svg
						height="100%"
						width="100%"
						fill="currentColor"
						viewBox="0 0 256 256"
						><path
							d="M224,128a96,96,0,0,1-94.71,96H128A95.38,95.38,0,0,1,62.1,197.8a8,8,0,0,1,11-11.63A80,80,0,1,0,71.43,71.39a3.07,3.07,0,0,1-.26.25L44.59,96H72a8,8,0,0,1,0,16H24a8,8,0,0,1-8-8V56a8,8,0,0,1,16,0V85.8L60.25,60A96,96,0,0,1,224,128Z"
						></path></svg
					>
				</span>
				<span>Refresh status</span>
			</button>
		{/if}
	</header>

	<!-- <div role="alert" class="bg-green-100 text-green-600 p-4 flex gap-2 items-center m-5">
		<div
			class="h-5 w-5 bg-green-600 text-white text-xs flex items-center justify-center rounded-full"
		>
			✓
		</div>
		<span>Application sent successfully.</span>
	</div> -->
	<div
		class="shadow-md bg-white flex-[0.4] min-h-[35vh] py-10 shrink-0 flex flex-col items-center justify-center h-full"
	>
		<div
			class="flex flex-col items-center justify-center gap-5 text-center max-w-[80%]"
		>
			<div
				class={`${statusMap[data.status].text} ${statusMap[data.status].bg} w-[20%] h-[20%] rounded-full p-4`}
			>
				<svelte:component this={statusMap[data.status].icon} />
			</div>
			<h3 class={`text-xl font-medium ${statusMap[data.status].text}`}>
				{statusMap[data.status].message}
			</h3>
			<p class="text-secondary">{statusMap[data.status].subText}</p>
		</div>
		<h4 class="pt-5">Your Token No</h4>
		<h2 class="text-2xl font-bold border px-4 py-2 mt-1 bg-slate-50 rounded">
			{data.Token}
		</h2>
	</div>
	<div
		class={`${statusMap[data.status].secondaryBg} text-white flex-[0.6] rounded-xl flex flex-col gap-4 p-5 pb-10`}
	>
		<h2 class="text-2xl">Details</h2>
		<div class="flex flex-col gap-4">
			<div class="flex w-full gap-4 py-3">
				<div class="w-[40%] pl-0 align-top">Name</div>
				<div class="w-[60%] pl-0 align-top font-light break-all">
					{data.Name}
				</div>
			</div>
			<div class="flex w-full gap-4 py-3">
				<div class="w-[40%] pl-0 align-top">Email</div>
				<div class="w-[60%] pl-0 align-top font-light break-all">
					{data.Email}
				</div>
			</div>
			<div class="flex w-full gap-4 py-3">
				<div class="w-[40%] pl-0 align-top">Phone</div>
				<div class="w-[60%] pl-0 align-top font-light break-all">
					{data.Phone}
				</div>
			</div>
			<div class="flex w-full gap-4 py-3">
				<div class="w-[40%] pl-0 align-top">Address</div>
				<div class="w-[60%] pl-0 align-top font-light break-all">
					{data.Address}
				</div>
			</div>
			<div class="flex w-full gap-4 py-3">
				<div class="w-[40%] pl-0 align-top">Purpose for visit</div>
				<div class="w-[60%] pl-0 align-top font-light break-all">
					{data.Purpose}
				</div>
			</div>
			<hr class="w-full" />
			{#if data.comment}
				<div class="flex w-full gap-4 py-5">
					<div class="w-[40%] pl-0 align-top">Comment</div>
					<div class="w-[60%] pl-0 align-top font-light break-all">
						{data.comment}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
