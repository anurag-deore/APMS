<script lang="ts">
	import { appointments } from '$lib/dataStore';
	import AllAppointments from './AllAppointments.svelte';
	import OpenAppn from './OpenAppn.svelte';

	export let data;
	export let activeTabValue = 1;

	let unSubscribe: () => void;
	$: {
		if (unSubscribe) {
			unSubscribe();
		}
		unSubscribe = appointments.subscribe((apts) => {
			data = { data: apts };
		});
	}

	$: appointmentList = data.data;

	const handleClick = (tabValue: number) => () => (activeTabValue = tabValue);
	// List of tab items with labels, values and assigned components
	let items = [
		{ label: 'Open', value: 1, component: OpenAppn },
		// { label: 'Closed', value: 2, component: Completed },
		{ label: 'All', value: 3, component: AllAppointments }
	];
</script>

<!-- src/routes/protected/+page.svelte -->

<svelte:head>
	<title>App Appointments</title>
</svelte:head>
<div class="flex flex-col flex-1 mb-3 overflow-hidden">
	<h2 class="text-xl font-semibold px-3 py-3">Appointments</h2>

	<div class="flex mb-3">
		{#each items as item}
			<button
				on:click={handleClick(item.value)}
				class={`flex-1 p-4 bg-white hover:bg-gray-100 border-b-2 ${activeTabValue === item.value ? ' border-black' : 'border-white'}`}
			>
				{item.label}
			</button>
		{/each}
	</div>
	<div class="grow flex flex-col px-3 gap-3 overflow-y-auto">
		{#each items as item}
			{#if activeTabValue == item.value}
				<svelte:component this={item.component} data={appointmentList} />
			{/if}
		{/each}
	</div>
</div>
