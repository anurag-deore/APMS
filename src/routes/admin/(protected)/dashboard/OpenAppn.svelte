<script lang="ts">
	import Alldone from '$lib/assets/Alldone.svelte';
	import ApptCard from '$lib/components/ApptCard.svelte';
	import { STATUS } from '$lib/constants';
	import type { AppointmentSchema } from '../../../../app';

	export let data: AppointmentSchema[];
	$: completedAppns = data.filter((appn) => appn.status === STATUS.PENDING);
</script>

<div class="grow h-full">
	{#if completedAppns.length === 0}
		<div
			class="text-center grow h-full flex flex-col justify-center items-center gap-8"
		>
			<div class="w-1/2 max-w-[400px]">
				<Alldone />
			</div>
			<h2 class="text-gray-500">All done! <br />No Open Appointments</h2>
		</div>
	{:else}
		<div class="flex flex-col md:flex-row md:flex-wrap items-center gap-3">
			{#each completedAppns as appt}
				<ApptCard {appt} />
			{/each}
		</div>
	{/if}
</div>
