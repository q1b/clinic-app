<script context="module">
	import * as Avatar from '$lib/components/ui/avatar';
	export const meta = {
		title: 'Components/Avatar',
		component: Avatar,
		tags: ['autodocs'],
		argTypes: {
			builders: {
				control: false
			}
			// variant: {
			// 	control: { type: 'select' },
			// 	options: Object.keys(variants),
			// 	defaultValue: 'default'
			// },
			// size: {
			// 	control: { type: 'select' },
			// 	options: Object.keys(sizes),
			// 	description: 'The size of the button',
			// 	defaultValue: 'sm'
			// }
		}
	};
</script>

<script>
	import { Story, Template } from '@storybook/addon-svelte-csf';
</script>

<Story name="Default">
	<Avatar.Root>
		<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
		<Avatar.Fallback>CN</Avatar.Fallback>
	</Avatar.Root>
</Story>
