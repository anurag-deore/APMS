<script lang="ts">
	import Alldone from '$lib/assets/Alldone.svelte';
	import ApptCard from '$lib/components/ApptCard.svelte';
	import type { AppointmentSchema } from '../../../../app';

	export let data: AppointmentSchema[];
</script>

<!-- {#each data as appt}
	<ApptCard {appt} />
{/each} -->

<div class="grow h-full">
	{#if data.length === 0}
		<div
			class="text-center grow h-full flex flex-col justify-center items-center gap-8"
		>
			<div class="w-1/2 max-w-[400px]">
				<Alldone />
			</div>
			<h2 class="text-gray-500">All done! <br />No Appointments yet</h2>
		</div>
	{:else}
		<div
			class={`flex flex-col lg:flex-row lg:items-stretch lg:justify-start items-center` +
				`flex-nowrap lg:flex-wrap gap-3 pb-10 h-full !overflow-y-auto`}
		>
			{#each data as appt}
				<ApptCard {appt} />
			{/each}
		</div>
	{/if}
</div>
