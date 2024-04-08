<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	// get onclick function,title and type as props
	export let onclick: () => void;
	export let type: 'accept' | 'decline' | 'default' | 'primary' = 'default';
	export let title: string;
	export let isLoading: boolean = false;
	export let isDisabled: boolean = false;
	export let icon: ConstructorOfATypedSvelteComponent | null = null;
	export let className: string = '';

	const handleClick = () => {
		onclick();
	};

	const colorMap = {
		default:
			'disabled:active:bg-transparent active:bg-slate-200 text-slate-600 border-slate-300 bg-slate-100',
		primary:
			'disabled:active:bg-transparent active:bg-primary text-white border-primary bg-primary',
		decline:
			'disabled:active:bg-transparent active:bg-red-200 text-red-600 border-red-200 bg-red-100',
		accept:
			'disabled:active:bg-transparent active:bg-green-200 text-green-600 border-green-300 bg-green-100'
	};
</script>

<button
	disabled={isDisabled}
	on:click={handleClick}
	class={`flex-1 transition-all text-sm p-3 flex border items-center rounded justify-center gap-3 ${colorMap[type]} ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer active:scale-95'} ${className}`}
>
	{#if isLoading}
		<span class="loading loading-spinner w-3 h-3"></span>
	{:else if icon}
		<span class="w-4 h-4">
			<svelte:component this={icon} />
		</span>
	{/if}
	{title}
</button>
