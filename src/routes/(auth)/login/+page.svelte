<script lang="ts">
	import { goto } from '$app/navigation';
	import Form from './form.svelte';
	// let req: 'idle' | 'validating' | 'validated' | 'unvalidated' = 'idle';
</script>

<div class="w-full xs:max-w-sm px-4 xs:px-2 sm:px-0">
	<Form
		redirect
		on:click={() => goto('/signup')}
		on:load={(e) => console.log(e.detail.validated)}
	/>
	<!-- <div>
			<h2 class="text-layer-13 font-bold">Response</h2>
			<a class="text-sky-400 font-medium underline underline-offset-4" href="/">Go to Home</a>
		</div> -->
</div>
