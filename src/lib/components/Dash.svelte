<script lang="ts">
	export let rounded = false;
	export let width = 8;
	export let space = 1;
	// <Dash space={1} width={8} />
</script>

<span
	style:width="{width}px"
	style:margin-left="{space}px"
	style:margin-right="{space}px"
	class:rounded-full={rounded}
	class="h-0.5 bg-slate-900"
>
</span>
