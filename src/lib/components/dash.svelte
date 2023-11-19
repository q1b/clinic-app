<script lang="ts">
	import { cn } from '$lib/utils';

	export let rounded = false;
	export let width = 4;
	export let height = 1;
	export let space = 1;
	type Props = {
		class?: string;
	};
	let className: Props['class'] = undefined;
	export { className as class };
</script>

<span
	style:padding-left="{width}px"
	style:padding-right="{width}px"
	style:margin-left="{space}px"
	style:margin-right="{space}px"
	style:padding-top="{height}px"
	style:padding-bottom="{height}px"
	class:rounded-full={rounded}
	class={cn('h-0.5 bg-slate-900', className)}
>
</span>
