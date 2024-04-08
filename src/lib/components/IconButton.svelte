<script lang="ts">
	export let icon: ConstructorOfATypedSvelteComponent;
	export let title: string | undefined = undefined;
	export let className: string = '';
	export let onClick: () => void;
	export let disabled: boolean = false;
</script>

<button
	on:click={onClick}
	{disabled}
	class={`flex items-center w-fit rounded-xl border gap-4 ${className}`}
>
	<span class="w-5 h-5">
		<svelte:component this={icon} />
	</span>
	{#if title}
		<span>{title}</span>
	{/if}
</button>
