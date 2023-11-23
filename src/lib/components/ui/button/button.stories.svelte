<script context="module">
	import Button from '$lib/components/ui/button/button.svelte';
	export const meta = {
		title: 'Components/Button',
		component: Button,
		tags: ['autodocs'],
		argTypes: {
			builders: {
				control: false
			},
			variant: {
				control: { type: 'select' },
				options: Object.keys(variants),
				defaultValue: 'default'
			},
			size: {
				control: { type: 'select' },
				options: Object.keys(sizes),
				description: 'The size of the button',
				defaultValue: 'sm'
			}
		}
	};
</script>

<script>
	import { Story, Template } from '@storybook/addon-svelte-csf';
	import { Edit2, LogOutIcon } from 'lucide-svelte';
	import { sizes, variants } from '.';

	let count = 0;
	function handleClick() {
		count += 1;
	}
</script>

<Template let:args>
	<!--👇 'on:click' allows to forward event to addon-actions  -->
	<Button {...args} on:click on:click={handleClick}>
		You clicked: {count}
	</Button>
</Template>

<!-- Dynamic snippet should be disabled for this story -->
<Story name="Button No Args" />

<Story name="Solid">
	<div class="flex items-center gap-x-4">
		{#each Object.keys(sizes) as size}
			<Button icon={Edit2} {size} variant="default" on:click on:click={handleClick}>
				Edit Text
			</Button>
		{/each}
	</div>
</Story>
<Story name="outline">
	<div class="flex items-center gap-x-4">
		{#each Object.keys(sizes) as size}
			<Button icon={LogOutIcon} {size} variant="outline" on:click on:click={handleClick}>
				Click
			</Button>
		{/each}
	</div>
</Story>
<Story name="secondary">
	<div class="flex items-center gap-x-4">
		{#each Object.keys(sizes) as size}
			<Button icon={LogOutIcon} {size} variant="secondary" on:click on:click={handleClick}>
				Log out</Button
			>
		{/each}
	</div>
</Story>
<Story name="ghost">
	<div class="flex items-center gap-x-4">
		{#each Object.keys(sizes) as size}
			<Button icon={LogOutIcon} {size} variant="ghost" on:click on:click={handleClick}>
				Log out</Button
			>
		{/each}
	</div>
</Story>
<Story name="Link">
	<div class="flex items-center gap-x-4">
		{#each Object.keys(sizes) as size}
			<Button icon={LogOutIcon} {size} variant="link" on:click on:click={handleClick}>
				Log out</Button
			>
		{/each}
	</div>
</Story>

<Story name="Destructive">
	<div class="flex items-center gap-x-4">
		{#each ['sm', 'default', 'lg', 'icon'] as size}
			<Button icon={LogOutIcon} {size} variant="destructive" on:click on:click={handleClick}>
				Log out</Button
			>
		{/each}
	</div>
</Story>
