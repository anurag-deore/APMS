<script lang="ts">
	import ExportIcon from '$lib/assets/ExportIcon.svelte';
	import Button from '$lib/components/Button.svelte';
	import {
		collection,
		query,
		getDocs,
		where,
		Timestamp
	} from 'firebase/firestore';
	import { db } from '$lib/firebase';

	let exportDataError = '';
	let isExporting = false;
	let startDate = '';
	let endDate = '';

	async function handleDownload() {
		const startDateVal = new Date(startDate);
		const endDateVal = new Date(endDate);
		if (isNaN(startDateVal.getTime()) || isNaN(endDateVal.getTime())) {
			exportDataError = 'Please select valid date range';
			return;
		}
		if (startDate > endDate) {
			exportDataError = 'End date should be after start date';
			return;
		}
		isExporting = true;
		try {
			const appointmentsRef = collection(db, 'appointments');
			const allDocs = query(
				appointmentsRef,
				where('timestamp', '>=', Timestamp.fromDate(startDateVal)),
				where('timestamp', '<=', Timestamp.fromDate(endDateVal))
			);
			const querySnapshot = await getDocs(allDocs);
			const data = querySnapshot.docs.map((doc) => doc.data());
			if (data.length === 0) {
				exportDataError = 'No data found for selected date range';
				return;
			}
			const transformedData = data.map((doc) => ({
				name: doc.name,
				address: doc.address.replace(/,/g, ' '),
				phone: doc.phone,
				email: doc.email,
				purpose: doc.purpose,
				timestamp: doc.timestamp.toDate().toLocaleDateString('en-GB'),
				comment: doc.comment || '',
				token: doc.token
			}));
			const csvData =
				Object.keys(transformedData[0]).join(',') +
				'\n' +
				transformedData.map((row) => Object.values(row).join(',')).join('\n');
			const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `appointments_${startDateVal.toISOString().slice(0, 10)}_${endDateVal.toISOString().slice(0, 10)}.csv`;
			link.click();
			URL.revokeObjectURL(url);
			exportDataError = '';
		} catch (error) {
			exportDataError = `Error fetching data: ${error}`;
		} finally {
			isExporting = false;
		}
	}
</script>

<div class="flex flex-col justify-center items-center">
	<h2 class="text-lg font-semibold py-5 px-5">Export Data</h2>
	<div class="flex flex-col w-full md:w-1/2 gap-5 bg-white p-5">
		{#if exportDataError}
			<div class="text-red-500 bg-red-100 px-5 py-3 rounded-md">
				{exportDataError}
			</div>
		{/if}
		<h3 class="text-lg text-gray-600">Select Date Range to export</h3>
		<small class="text-secondary"
			>Export all appointments in for a date range in CSV format</small
		>
		<form class="flex flex-col gap-4 bg-white">
			<label class="form-control w-full max-w-full">
				<div class="label">
					<span class="label-text">Start Date:</span>
				</div>
				<input
					id="start-date"
					type="date"
					bind:value={startDate}
					disabled={isExporting}
					class="input input-bordered w-full max-w-full"
				/>
			</label>
			<label class="form-control w-full max-w-full">
				<div class="label">
					<span class="label-text">End Date:</span>
				</div>
				<input
					id="end-date"
					type="date"
					bind:value={endDate}
					disabled={isExporting}
					class="input input-bordered w-full max-w-full"
				/>
			</label>
		</form>
		<Button
			type="primary"
			title="Download"
			isDisabled={isExporting}
			isLoading={isExporting}
			icon={ExportIcon}
			onclick={handleDownload}
		/>
	</div>
</div>
