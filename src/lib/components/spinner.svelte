<script lang="ts">
	import { cn } from '$lib/utils';
	import { Loader2Icon } from 'lucide-svelte';

	export let size: number = 32;
	type Props = {
		class?: string;
	};
	let className: Props['class'] = undefined;
	export { className as class };
</script>

<Loader2Icon {size} class={cn('animate-spin', className)} />
