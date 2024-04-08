<script lang="ts">
	import CancelIcon from '$lib/assets/CancelIcon.svelte';
	import CheckIcon from '$lib/assets/CheckIcon.svelte';
	import HomeIcon from '$lib/assets/HomeIcon.svelte';
	import Button from '$lib/components/Button.svelte';
	import { STATUS } from '$lib/constants';
	import { doc, setDoc, updateDoc } from 'firebase/firestore';
	import type { AppointmentSchema } from '../../../../../app';
	import type { PageData } from './$types';
	import { db } from '$lib/firebase';
	import ChevronRight from '$lib/assets/ChevronRight.svelte';
	import { get } from 'svelte/store';
	import { settingsStore } from '$lib/dataStore';

	export let data: AppointmentSchema;

	let comment = data.comment ?? '';
	let isUpdating: boolean = false;

	const tagColors = {
		[STATUS.APPROVED]: 'bg-green-100 text-green-600 border-green-300',
		[STATUS.REJECTED]: 'bg-red-100 text-red-600 border-red-300',
		[STATUS.PENDING]: 'bg-yellow-100 text-yellow-600 border-yellow-300'
	};

	const commentSuggestions = get(settingsStore).commentList ?? [];

	function setCommentFromSuggestion(index: number) {
		comment = commentSuggestions[index];
	}

	function handleCommentChange(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		comment = target.value;
	}

	async function updateAndSetStatus(status: 'accept' | 'decline') {
		const finalStatus = status === 'accept' ? STATUS.APPROVED : STATUS.REJECTED;
		isUpdating = true;
		try {
			const docRef = doc(db, 'appointments', data.id!);
			await updateDoc(docRef, {
				status: finalStatus,
				comment: comment
			});
			data = { ...data, status: finalStatus, comment };
		} catch (error) {
			console.error(error);
		} finally {
			isUpdating = false;
		}
	}
</script>

<div class="container min-h-screen flex flex-col relative">
	<div class="px-5 py-3 flex flex-col">
		<div class="flex items-center gap-3 pb-3">
			<a
				href="/admin/dashboard"
				class="flex rotate-180 w-7 h-7 bg-white p-1 border border-gray-400 rounded-md"
			>
				<ChevronRight />
			</a>
			<h2 class="font-semibold text-xl">Appointment Details</h2>
		</div>
		<div class="flex w-full justify-between items-center">
			<div class="text-sm grow text-slate-500">21 March 2024, 12:34 PM</div>
			<div
				class={`px-2 py-1 whitespace-pre ${tagColors[data.status]} rounded text-xs`}
			>
				{data.status}
			</div>
		</div>
	</div>
	<div class="flex flex-col gap-4 p-5 text-sm bg-white">
		<div class="w-full flex flex-col gap-2">
			<div class="text-slate-400">Name</div>
			<div class="font-normal p-2 bg-gray-100">{data.name}</div>
		</div>
		<div class="w-full flex flex-col gap-2">
			<div class="text-slate-400">Address</div>
			<div class="font-normal p-2 bg-gray-100">
				{data.address}
			</div>
		</div>
		<div class="flex gap-3 w-full">
			<div class="flex-1 flex flex-col gap-2">
				<div class="text-slate-400">Token</div>
				<div class="font-normal p-2 bg-gray-100">
					{data.token}
				</div>
			</div>
			<div class="flex-1 flex flex-col gap-2">
				<div class="text-slate-400">Phone</div>
				<div class="font-normal p-2 bg-gray-100">
					{data.phone}
				</div>
			</div>
		</div>
		<div class="w-full flex flex-col gap-2">
			<div class="text-slate-400">Email</div>
			<div class="font-normal p-2 bg-gray-100 whitespace-pre overflow-x-auto">
				{data.email}
			</div>
		</div>
		<div class="w-full flex flex-col gap-2">
			<div class="text-slate-400">Purpose</div>
			<div class="font-normal p-2 bg-gray-100">
				{data.purpose}
			</div>
		</div>

		<div class="w-full flex flex-col gap-2">
			<div class="text-slate-400">Time</div>
			<div class="font-normal p-2 bg-gray-100">
				{new Date(data.timestamp.seconds).toLocaleString()}
			</div>
		</div>
		<div class="w-full text-sm">
			<div class="text-slate-400 pb-2">Comment (optional)</div>
			<textarea
				bind:value={comment}
				on:change={handleCommentChange}
				name="comment"
				id="comment"
				class="w-full textarea textarea-bordered rounded-md"
			></textarea>
			<div class="py-2 text-sm text-slate-600 font-medium text-center">
				OR select from below
			</div>
			<div class="flex gap-2 w-full overflow-x-scroll pb-2">
				{#each commentSuggestions as index, i}
					<!-- <div
						class="py-2 px-4 rounded-full text-sm text-slate-600 border whitespace-nowrap bg-white border-gray-300"
					>
						Out of office.
					</div> -->
					<button
						on:click={() => setCommentFromSuggestion(i)}
						class="bg-slate-100 text-sm shrink-0 py-1 rounded-full px-3 border focus:border-black active:border-black"
						>{index}</button
					>
				{/each}
			</div>
		</div>
		<div class="flex flex-col gap-3 py-2 mb-10">
			{#if data.status !== STATUS.APPROVED}
				<Button
					onclick={() => {
						updateAndSetStatus('accept');
					}}
					isDisabled={isUpdating}
					isLoading={isUpdating}
					icon={CheckIcon}
					type="accept"
					title="Approve"
				/>
			{/if}
			{#if data.status !== STATUS.REJECTED}
				<Button
					onclick={() => {
						updateAndSetStatus('decline');
					}}
					isDisabled={isUpdating}
					isLoading={isUpdating}
					icon={CancelIcon}
					type="decline"
					title="Decline"
				/>
			{/if}
		</div>
	</div>
</div>
