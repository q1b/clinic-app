<script lang="ts">
	export let rounded = false;
	export let width = 4;
	export let height = 1;
	export let space = 1;
	// <Dash space={1} width={8} />
</script>

<span
	style:padding-left="{width}px"
	style:padding-right="{width}px"
	style:margin-left="{space}px"
	style:margin-right="{space}px"
	style:padding-top="{height}px"
	style:padding-bottom="{height}px"
	class:rounded-full={rounded}
	class="h-0.5 bg-slate-900"
>
</span>
