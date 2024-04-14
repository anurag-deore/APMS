<script lang="ts">
	import { doc, setDoc, type Timestamp } from 'firebase/firestore';
	import type { AppointmentSchema } from '../../app';
	import Button from '$lib/components/Button.svelte';
	import CheckIcon from '../assets/CheckIcon.svelte';
	import CancelIcon from '../assets/CancelIcon.svelte';
	import { appointments } from '$lib/dataStore';
	import { STATUS } from '$lib/constants';
	import ChevronRight from '$lib/assets/ChevronRight.svelte';

	export let appt: AppointmentSchema;

	let isApproving = false;

	let isDeclining = false;

	const bottomColorMap = {
		[STATUS.APPROVED]: 'bg-green-50 text-green-800 border-green-600',
		[STATUS.REJECTED]: 'bg-red-50 text-red-800 border-red-600',
		[STATUS.PENDING]: 'bg-blue-50 text-slate-600 border-transparent'
	};

	const convertTimestampToDate = (timestamp: Timestamp | undefined) => {
		if (!timestamp) return Date.now().toLocaleString;
		// const date = new Date(timestamp.).toDateString();
		return timestamp.toDate().toLocaleString();
	};

	const handleApprove = () => {
		isApproving = true;
		appointments.update((data) => {
			return data.map((appn) => {
				if (appn.id === appt.id) {
					return {
						...appn,
						status: STATUS.APPROVED
					};
				}
				return appn;
			});
		});
		isApproving = false;
		// setDoc(
		// 	doc(db, 'appointments', appt.id!),
		// 	{ status: STATUS.APPROVED },
		// 	{ merge: true }
		// )
		// 	.then((res) => {
		// 		alert('Approved');
		// 		console.log(res);
		// 		appointments.update((data) => {
		// 			return data.map((appn) => {
		// 				if (appn.id === appt.id) {
		// 					return {
		// 						...appn,
		// 						status: STATUS.APPROVED
		// 					};
		// 				}
		// 				return appn;
		// 			});
		// 		});
		// 		isApproving = false;
		// 	})
		// 	.catch((err) => {
		// 		console.log(err);
		// 		isApproving = false;
		// 	});
	};

	const handleDecline = () => {
		isDeclining = true;
		appointments.update((data) => {
			return data.map((appn) => {
				if (appn.id === appt.id) {
					return {
						...appn,
						status: STATUS.REJECTED
					};
				}
				return appn;
			});
		});
		isDeclining = false;
	};

	$: statusColor = () => {
		switch (appt.status) {
			case STATUS.APPROVED:
				return 'border-green-500';
			case STATUS.REJECTED:
				return 'border-red-400';
			default:
				return 'border-gray-400';
		}
	};
</script>

<a
	href="/admin/appointment/{appt.token}"
	class={`w-full lg:w-[49%] bg-white h-fit relative rounded flex flex-col border border-slate-200 ${statusColor()}`}
>
	<div class="flex flex-col gap-5 p-4 grow">
		<div class="line-clamp-3 grow">{appt.purpose}</div>
		<div class="flex items-center justify-between">
			<div class="text-sm text-slate-500 font-medium">{appt.name}</div>
			<div class="text-xs text-slate-500">
				{convertTimestampToDate(appt.timestamp)}
			</div>
		</div>
	</div>
	<div
		class={`flex justify-between items-center w-full
		 ${bottomColorMap[appt.status]} border-l-2 pl-4 pr-2 py-3`}
	>
		<div class="text-sm grow">Token : {appt.token}</div>
		<div class="w-5 h-5">
			<ChevronRight />
		</div>
	</div>
</a>
