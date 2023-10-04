<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { CheckCircle2Icon, Loader2Icon, MousePointer2Icon, XCircleIcon } from 'lucide-svelte';
	import type { ActionData } from './$types';
	let loading = false;
	export let form: ActionData;
</script>

<div class="p-4 w-full flex flex-col gap-y-4 items-center justify-center">
	<h1>Phone Auth Experiement</h1>
	{#if form?.verified}
		<div
			class="bg-lime-50 border border-teal-500 text-teal-600 font-semibold flex items-center gap-x-2 px-4 py-3 rounded-md"
		>
			<CheckCircle2Icon class="inline-block" />
			Congratulations, you are verified!
		</div>
	{:else if form?.failed}
		<div
			class="bg-rose-50 border border-red-500 text-rose-600 font-semibold flex items-center gap-x-2 px-4 py-3 rounded-md"
		>
			<XCircleIcon class="inline-block" />
			you failed to verify! Try Again
		</div>
	{:else}
		<form
			method="POST"
			action={form?.sended ? '?/verifyCode' : '?/sendCode'}
			class="w-full p-2 bg-white shadow-sm"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					await update({ reset: false });
					loading = false;
				};
			}}
		>
			<div class="flex flex-col gap-y-2 mb-2">
				<Label for="phone_number">Phone Number</Label>
				<Input type="tel" name="phone_number" id="phone_number" />
			</div>
			{#if form?.sended}
				<div class="flex flex-col gap-y-2 mb-4">
					<Label for="verify_code">Verification Code</Label>
					<Input type="text" name="verify_code" id="verify_code" />
				</div>
			{/if}
			<Button class="items-center gap-x-2 justify-center px-3 pr-3.5">
				{#if loading}
					<Loader2Icon class="w-4 h-4 animate-spin" />
				{:else}
					<MousePointer2Icon class="w-4 h-4" />
				{/if}
				{form?.sended ? 'Verify' : 'Send OTP'}
			</Button>
		</form>
	{/if}
</div>
