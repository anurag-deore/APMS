<script>
	import ChevronRight from '$lib/assets/ChevronRight.svelte';
</script>

<div
	class="pattern px-4 flex flex-col gap-8 items-center h-screen justify-center overflow-hidden"
>
	<!-- class="container px-4 flex flex-col gap-8 items-center justify-center h-screen bg-gradient-to-b from-blue-400 to-blue-600" -->
	<div
		class="bg-white border shadow-lg rounded-xl md:h-[15vw] md:w-[15vw] h-[50vw] w-[50vw] flex items-center justify-center"
	>
		<img
			src="https://images.collegedunia.com/public/college_data/images/logos/1585032003unnamed.png"
			alt="Anna leela logo"
		/>
	</div>
	<h1 class="text-3xl font-semibold text-center w-min">
		ALJSC Appointment Scheduling
	</h1>
	<a
		class="flex rounded-full text-xl bg-primary text-white p-1 px-3 items-center"
		href="/application"
	>
		<span class="font-normal py-3 px-5">Start Application</span>
		<div class="h-8 w-8 p-1.5 !bg-white !text-primary rounded-full">
			<ChevronRight />
		</div>
	</a>
	<hr class="w-1/2" />
	<div class="text-semibold text-center text-secondary">
		Already submitted a application ?
		<br />
		<a class="underline underline-offset-5 text-primary" href="/checkStatus"
			>Check Status</a
		>
	</div>
</div>
