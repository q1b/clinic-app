<script lang="ts">
	import type { ActionData } from './$types';
	import Form from './form.svelte';
	// let req: 'idle' | 'validating' | 'validated' | 'unvalidated' = 'idle';
	export let form: ActionData;
</script>

<div class="w-full xs:max-w-sm px-4 xs:px-2 sm:px-0">
	{#if form?.message}
		<p>{form.message}</p>
	{/if}
	<div class="mb-8">
		<h2 class="text-layer-13 font-bold text-2xl mb-2">Sign in to your account</h2>
		<p>
			Don't have an account? <a
				href="/signup"
				class="text-sky-400 font-medium underline underline-offset-4">Sign up</a
			> for free
		</p>
	</div>
	<Form redirect on:load={(e) => console.log(e.detail.validated)} />
	<!-- <div>
			<h2 class="text-layer-13 font-bold">Response</h2>
			<a class="text-sky-400 font-medium underline underline-offset-4" href="/">Go to Home</a>
		</div> -->
</div>
