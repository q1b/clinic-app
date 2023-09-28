<script lang="ts">
	import { cn } from '$lib/helpers/utils';
	import { InitResult, type InitFunctionType } from '$lib/helpers/state';
	import { getContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';

	let className: string | undefined | null = undefined;
	export { className as class };
	export let value: string;
	export let id: string | undefined = undefined;
	export let disabled: boolean = false;
	export let name: string = 'radio-group-items';
	let initResult: InitResult = new InitResult();
	let checkedStore: Writable<boolean> = writable(false);
	let {
		disabled: allDisabled,
		defaultValue,
		init
	}: { disabled: boolean; defaultValue: string; init: InitFunctionType } = getContext(
		'radio-group'
	);

	disabled = disabled || allDisabled;
</script>

<div class="relative">
	<button
		use:init={{ store: checkedStore, value, initResult }}
		on:click={initResult.toggleItem}
		{id}
		{disabled}
		{value}
		tabindex={$checkedStore || (initResult?.index == 0 && !defaultValue) ? 0 : -1}
		aria-checked={$checkedStore}
		data-state={$checkedStore ? 'checked' : 'unchecked'}
		type="button"
		role="radio"
		class={cn(
			'form-input focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
			className,
			$checkedStore ? 'bg-blue-500 text-white' : 'bg-white'
		)}
	>
		{value}
		<!-- {#if $checkedStore}
		<span data-state="checked" class="flex items-center justify-center">
			<Circle class="h-2.5 w-2.5 fill-current text-current" />
		</span>
	{/if} -->
	</button>
	<input
		checked={$checkedStore}
		{disabled}
		{value}
		{name}
		aria-hidden="true"
		tabindex="-1"
		type="radio"
		class="pointer-events-none absolute !m-0 h-4 w-4 opacity-0"
	/>
</div>
