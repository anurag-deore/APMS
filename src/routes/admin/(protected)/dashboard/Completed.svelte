<script lang="ts">
	import { STATUS } from '$lib/constants';
	import type { AppointmentSchema } from '../../../../app';

	export let data: AppointmentSchema[];

	const completedAppns = data.filter((appn) => appn.status === STATUS.APPROVED);
</script>

{#each completedAppns as appt}
	<div class="card bg-white rounded">
		<div class="card-body">
			<div class="card-title">{appt.token}</div>
		</div>
	</div>
{/each}
