<script lang="ts">
	import GoogleIcon from '$lib/components/ui/icons/google.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { PageData } from './$types';
	import { InfoIcon } from 'lucide-svelte';
	export let data: PageData;
</script>

<form class="bg-layer-2 shadow-sm shadow-layer-6 ring-1 ring-layer-3/5 rounded-xl w-full max-w-lg">
	<div class="px-4 py-6 sm:p-8">
		<div class="mb-3">
			<h2 class="text-base font-semibold leading-7 text-layer-12">
				Osteopath's Registration Portal
			</h2>
			<p class="mt-1 text-sm leading-6 text-layer-11">
				Sync your <strong>Google Calendar</strong> with app
			</p>
		</div>
		<Button
			href="/google/login?connect=true"
			variant="outline"
			class="bg-layer-0 dark:bg-layer-2 hover:bg-layer-1 dark:hover:bg-layer-1"
		>
			<GoogleIcon /> Connect
		</Button>
	</div>
</form>

<div class="w-full max-w-lg flex flex-col items-center mt-6">
	<div
		class="inline-flex gap-x-2 mb-4 bg-layer-3 text-layer-12 p-4 rounded-md border border-layer-0"
	>
		<span><InfoIcon size={20} /></span>
		<p class="font-bold text-sm self-end">
			Sri Sri University Email Address is used for validation that you are currently a student
			studying or studied Osteopathy in campus.
		</p>
	</div>
</div>
