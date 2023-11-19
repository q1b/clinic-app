<script lang="ts">
	import { enhance } from '$app/forms';
	import Spinner from '$lib/components/spinner.svelte';
	import { ArrowRightCircleIcon, CheckCircleIcon } from 'lucide-svelte';

	export let el: HTMLDialogElement;
	let otp: 'idle' | 'sending' | 'sended' | 'verifying' | 'verified' | 'unverified' = 'idle';
</script>

<dialog
	bind:this={el}
	class="p-4 w-full max-w-xs rounded-md shadow-md backdrop:supports-backdrop-blur:bg-layer-3/40 backdrop:supports-backdrop-blur:backdrop-blur bg-layer-5"
>
	{#if otp === 'idle' || otp === 'sending'}
		<form
			method="post"
			action="?/sendOTP"
			use:enhance={async () => {
				otp = 'sending';
				return async ({ update, result }) => {
					await update({ reset: false });
					otp = 'sended';
				};
			}}
		>
			<h2 class="text-layer-13 font-bold">Login Form</h2>
			<div class="">
				<div class="mb-4">
					<label for="phone-number" class="block text-sm font-medium leading-6 text-layer-13">
						Phone Number
					</label>
					<div class="mt-2">
						<div
							class="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-layer-3 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
						>
							<span class="flex select-none items-center pl-3 text-gray-600">+91&nbsp;</span>
							<input
								minlength="10"
								maxlength="10"
								required
								type="text"
								name="phone-number"
								inputmode="numeric"
								id="phone-number"
								autocomplete="tel"
								class="block flex-1 border-0 bg-transparent py-2 pl-1 text-gray-900 focus:ring-0"
							/>
						</div>
					</div>
				</div>
				<div>
					<label for="password" class="block text-sm font-medium leading-6 text-layer-13">
						Password
					</label>
					<div class="mt-1">
						<input
							type="password"
							required
							id="password"
							name="password"
							autocomplete="given-name"
							class="block w-full rounded-md py-1.5 border-0 focus:ring-indigo-500 shadow-sm ring-1 ring-inset ring-layer-3 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600"
						/>
					</div>
				</div>
			</div>
			<div class="flex gap-x-4 mt-4">
				<button
					type="button"
					class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
					on:click={(e) => {
						e.preventDefault();
						el.close();
					}}
				>
					Cancel
				</button>
				<button
					type="submit"
					class="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					disabled={otp === 'sending'}
				>
					Next
					{#if otp === 'sending'}
						<Spinner size={16} />
					{:else}
						<ArrowRightCircleIcon size={16} />
					{/if}
				</button>
			</div>
		</form>
	{:else if otp === 'sended' || otp === 'verifying'}
		<form
			method="post"
			action="?/verifyOTP"
			use:enhance={() => {
				otp = 'verifying';
				return async ({ update, result }) => {
					await update({ reset: false });
					console.log('RESULT ', JSON.stringify(result, null, 2));
					const verified = result.data?.verified;
					if (verified) {
						otp = 'verified';
						setTimeout(() => {
							el.close();
						}, 2000);
					} else {
						otp = 'unverified';
					}
				};
			}}
			class="flex flex-col gap-y-4"
		>
			<div>
				<h2 class="text-layer-13 font-bold">Verify OTP</h2>
			</div>
			<div>
				<label for="otp-code" class="block text-sm font-medium leading-6 text-layer-13">
					One-Time-Password
				</label>
				<div class="mt-1">
					<input
						type="text"
						id="otp-code"
						name="otp-code"
						autocomplete="one-time-code"
						inputmode="numeric"
						class="block w-full rounded-md py-1.5 border-0 focus:ring-indigo-500 shadow-sm ring-1 ring-inset ring-layer-3 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600"
					/>
				</div>
			</div>
			<div class="flex gap-x-4 mt-4">
				<button
					type="button"
					on:click={() => {
						otp = 'idle';
					}}
					disabled={otp === 'verified' || otp === 'verifying'}
					class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
				>
					Back
				</button>
				<!-- Primary buttons -->
				<button
					type="submit"
					class="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					disabled={otp === 'verifying'}
				>
					Verify
					{#if otp === 'verifying'}
						<Spinner size={16} />
					{:else}
						<CheckCircleIcon size={16} />
					{/if}
				</button>
			</div>
		</form>
	{:else}
		<div>
			<h2 class="text-layer-13 font-bold">OTP Status {otp}</h2>
		</div>
	{/if}
</dialog>
