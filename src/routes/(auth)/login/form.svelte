<script lang="ts">
	import { enhance } from '$app/forms';
	import Spinner from '$lib/components/spinner.svelte';
	import { ArrowRightCircle, EyeIcon, EyeOffIcon } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	const dispath = createEventDispatcher();
	let validating = false;
	let validated = false;
	let errMsg: string | null = null;
	export let redirect: boolean = false;
	let isPwdHidden = true;
</script>

<div class="mb-8">
	<h2 class="text-layer-13 font-bold text-2xl mb-2">Sign in to your account</h2>
	<p>
		Don't have an account? <button
			on:click
			class="text-sky-400 font-medium underline underline-offset-4">Sign up</button
		> for free
	</p>
</div>
<form
	method="post"
	use:enhance={async () => {
		validating = true;
		return async ({ update, result }) => {
			await update({ reset: false });
			validating = false;
			validated = result['data']?.validated;
			errMsg = result['data']?.message;
			dispath('load', { validated });
		};
	}}
	action="/login/?/login"
>
	<input type="hidden" name="redirect" value={redirect} />
	<div class="mb-4">
		<label for="phone-number" class="block text-sm font-medium leading-6 text-layer-10">
			Phone Number
		</label>
		<div class="mt-2">
			<div
				class="flex rounded-md bg-layer-2 caret-layer-12 shadow-sm shadow-layer-1 ring-1 ring-inset ring-layer-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-layer-9 sm:max-w-md"
			>
				<span class="flex select-none items-center pl-3 text-layer-11">+91&nbsp;</span>
				<input
					minlength="10"
					required
					maxlength="10"
					type="tel"
					name="phone-number"
					inputmode="numeric"
					id="phone-number"
					autocomplete="tel"
					class="block flex-1 border-0 bg-transparent py-2 pl-1 text-layer-12 focus:ring-0"
				/>
			</div>
			{#if errMsg}
				<div class="mt-2 text-sm text-rose-500 dark:text-rose-400 rounded-md">
					{errMsg}
				</div>
			{/if}
		</div>
	</div>
	<div class="mb-6">
		<label for="password" class="block text-sm font-medium leading-6 text-layer-10">
			Password
		</label>
		<div class="mt-1 relative">
			<input
				type={isPwdHidden ? 'password' : 'text'}
				id="password"
				name="password"
				required
				autocomplete="current-password"
				class="block w-full bg-layer-2 caret-layer-12 rounded-md py-2 border-0 shadow-sm shadow-layer-1 ring-1 ring-inset ring-layer-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-layer-9"
			/>
			<button
				on:click={() => (isPwdHidden = !isPwdHidden)}
				type="button"
				class="absolute right-2 top-1/2 -translate-y-1/2"
			>
				{#if isPwdHidden}
					<EyeIcon />
				{:else}
					<EyeOffIcon />
				{/if}
			</button>
		</div>
	</div>
	<div class="flex gap-x-4 mt-12">
		<!-- Primary -->
		<button
			type="submit"
			class="inline-flex items-center gap-x-2 px-3 py-1 bg-layer-12 hover:bg-layer-13 text-layer-1 rounded-md leading-6 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-layer-9"
			disabled={validating}
		>
			Submit
			{#if validating}
				<Spinner size={16} />
			{:else}
				<ArrowRightCircle size={16} />
			{/if}
		</button>
	</div>
</form>
