<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import Spinner from '$lib/components/spinner.svelte';
	import { ArrowRightCircleIcon, CheckCircleIcon } from 'lucide-svelte';
	let req: 'idle' | 'validating' | 'validated' | 'unvalidated' = 'idle';
	export let data: PageData;
</script>

<div class="w-full xs:max-w-sm px-4 xs:px-2 sm:px-0">
	{#if req === 'idle' || req === 'validating'}
		<div class="mb-8">
			<h2 class="text-layer-13 font-bold text-2xl mb-2">Sign in to your account</h2>
			<p>
				Don't have an account? <a
					href="/signup"
					class="text-sky-400 font-medium underline underline-offset-4">Sign up</a
				> for free
			</p>
		</div>
		<form
			method="post"
			use:enhance={async () => {
				req = 'validating';
				return async ({ update, result }) => {
					await update({ reset: false });
					req = 'validated';
				};
			}}
		>
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
				</div>
			</div>
			<div class="mb-6">
				<label for="password" class="block text-sm font-medium leading-6 text-layer-10">
					Password
				</label>
				<div class="mt-1">
					<input
						type="password"
						id="password"
						name="password"
						required
						autocomplete="current-password"
						class="block w-full bg-layer-2 caret-layer-12 rounded-md py-2 border-0 shadow-sm shadow-layer-1 ring-1 ring-inset ring-layer-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-layer-9"
					/>
				</div>
			</div>
			<div class="flex gap-x-4 mt-12">
				<!-- Primary -->
				<button
					type="submit"
					class="inline-flex items-center gap-x-2 px-3 py-1 bg-layer-12 hover:bg-layer-13 text-layer-1 rounded-md leading-6 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-layer-9"
					disabled={req === 'validating'}
				>
					Submit
					{#if req === 'validating'}
						<Spinner size={16} />
					{:else}
						<ArrowRightCircleIcon size={16} />
					{/if}
				</button>
				<!-- <button
					type="submit"
					class="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					disabled={otp === 'sending'}
				>
					Create Your Account
					{#if otp === 'sending'}
						<Spinner size={16} />
					{:else}
						<ArrowRightCircleIcon size={16} />
					{/if}
				</button> -->
			</div>
		</form>
	{:else}
		<div>
			<h2 class="text-layer-13 font-bold">Validated {req}</h2>
			<a class="text-sky-400 font-medium underline underline-offset-4" href="/">Go to Home</a>
		</div>
	{/if}
</div>
