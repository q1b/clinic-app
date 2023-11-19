<script context="module">
	import Button from '$lib/components/ui/button/button.svelte';
	export const meta = {
		title: 'Button',
		component: Button,
		tags: ['autodocs'],
		argTypes: {
			variant: {
				control: { type: 'select' },
				options: ['default']
			},
			size: {
				control: { type: 'select' },
				options: ['sm', 'default', 'lg', 'icon'],
				defaultValue: 'sm'
			}
		}
	};
</script>

<script>
	import { Story, Template } from '@storybook/addon-svelte-csf';

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

<!-- <Story name="Default" /> -->

<Story name="Default">
	<Button variant="default" on:click on:click={handleClick}>Log out</Button>
</Story>

<Story name="Destructive">
	<Button variant="destructive" on:click on:click={handleClick}>Log out</Button>
</Story>

<Story name="Subtle-Destructive">
	<Button variant="destructive-subtle" on:click on:click={handleClick}>Log out</Button>
</Story>

<!-- <Story name="Square" source args={{rounded: false}}/>  -->

<!-- Dynamic snippet should be disabled for this story -->
<Story name="Button No Args">
	<Button>Label</Button>
</Story>
