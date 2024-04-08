<script lang="ts">
	import ApptCard from '$lib/components/ApptCard.svelte';
	import type { AppointmentSchema } from '../../../../app';

	export let data: AppointmentSchema[];
</script>

{#each data as appt}
	<ApptCard {appt} />
{/each}
