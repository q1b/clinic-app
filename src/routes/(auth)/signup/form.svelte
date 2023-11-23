<script lang="ts">
	import { persist, createLocalStorage } from '@macfja/svelte-persistent-store';
	import { writable } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import Spinner from '$lib/components/spinner.svelte';
	import { ArrowRightCircleIcon, CheckCircleIcon, EyeIcon, EyeOffIcon } from 'lucide-svelte';
	let otp = persist<'idle' | 'sending' | 'sended' | 'verifying' | 'verified' | 'unverified'>(
		writable('idle'),
		createLocalStorage(),
		'otp'
	);

	// $otp = 'sended';
	let info = persist(
		writable({
			fullname: '',
			phone: '',
			password: ''
		}),
		createLocalStorage(),
		'info'
	);
	let isPwdHidden = true;
</script>

{#if $otp === 'idle' || $otp === 'sending'}
	<div class="mb-8">
		<h2 class="text-layer-13 font-bold text-2xl mb-2">Create Your Account</h2>
		<p>
			Already registered?
			<button class="text-sky-400 font-medium underline underline-offset-4" on:click
				>Sign in
			</button>
			to your account
		</p>
	</div>
	<form
		method="post"
		action="/(auth)/signup/?/sendOTP"
		use:enhance={async () => {
			$otp = 'sending';
			return async ({ update, result }) => {
				await update({ reset: false });
				$otp = 'sended';
			};
		}}
	>
		<div class="mb-4">
			<label for="full-name" class="block text-sm font-medium leading-6 text-layer-10">
				Full Name
			</label>
			<div class="mt-1">
				<input
					type="text"
					id="full-name"
					name="full-name"
					required
					on:change={(e) => ($info.fullname = e.currentTarget.value)}
					min="3"
					autocomplete="given-name"
					class="appearance-none block w-full bg-layer-2 caret-layer-12 rounded-md py-2 border-0 shadow-sm shadow-layer-1 ring-1 ring-inset ring-layer-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-layer-9"
				/>
			</div>
		</div>
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
						maxlength="10"
						type="tel"
						name="phone-number"
						on:change={(e) => ($info.phone = e.currentTarget.value)}
						inputmode="numeric"
						id="phone-number"
						required
						autocomplete="tel"
						class="appearance-none block flex-1 border-0 bg-transparent py-2 pl-1 text-layer-12 focus:ring-0"
					/>
				</div>
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
					on:change={(e) => ($info.password = e.currentTarget.value)}
					required
					autocomplete="current-password"
					class="appearance-none block w-full bg-layer-2 caret-layer-12 rounded-md py-2 border-0 shadow-sm shadow-layer-1 ring-1 ring-inset ring-layer-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-layer-9"
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
				disabled={$otp === 'sending'}
			>
				Submit
				{#if $otp === 'sending'}
					<Spinner size={16} />
				{:else}
					<ArrowRightCircleIcon size={16} />
				{/if}
			</button>
		</div>
	</form>
{:else if $otp !== 'verified'}
	<div class="mb-4">
		<h2 class="text-layer-13 font-bold">Verify OTP</h2>
	</div>
	<form
		method="post"
		action="?/verifyOTP"
		use:enhance={() => {
			$otp = 'verifying';
			return async ({ update, result }) => {
				await update({ reset: false });
				console.log('RESULT ', JSON.stringify(result, null, 2));
				const verified = result.data?.verified;
				if (verified) {
					$otp = 'verified';
				} else {
					$otp = 'unverified';
				}
				setTimeout(() => {
					if ($otp === 'unverified') $otp = 'sended';
					if ($otp === 'verified') {
						$otp = 'idle';
						goto('/');
					}
				}, 3000);
			};
		}}
		class="flex flex-col gap-y-4"
	>
		<input type="hidden" name="phone-number" value={$info.phone} />
		<input type="hidden" name="full-name" value={$info.fullname} />
		<input type="hidden" name="password" value={$info.password} />
		<div>
			<label for="otp-code" class="mb-2 block text-sm font-medium leading-6 text-layer-13">
				One-Time-Password
			</label>
			<div class="mt-1">
				<input
					type="text"
					id="otp-code"
					name="otp-code"
					autocomplete="one-time-code"
					required
					min="6"
					max="6"
					inputmode="numeric"
					class="block w-20 rounded-md bg-layer-1 py-1.5 border-0 focus:ring-indigo-500 shadow-sm ring-1 ring-inset ring-layer-3 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600"
				/>
				{#if $otp === 'unverified'}
					<p class="mt-2 text-rose-500">Invalid OTP Code</p>
				{/if}
			</div>
		</div>
		<div class="flex gap-x-4 mt-4">
			<button
				type="button"
				on:click={() => {
					$otp = 'idle';
				}}
				disabled={$otp === 'verifying'}
				class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
			>
				Back
			</button>
			<!-- Primary buttons -->
			<button
				type="submit"
				class="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
				disabled={$otp === 'verifying'}
			>
				Verify
				{#if $otp === 'verifying'}
					<Spinner size={16} />
				{:else}
					<CheckCircleIcon size={16} />
				{/if}
			</button>
		</div>
	</form>
{:else}
	<div>
		<h1 class="text-2xl mb-4">Account Created!</h1>
		<h2 class="mb-4 text-layer-13 font-bold">OTP Status {$otp}</h2>
		<a class="text-sky-400 font-medium underline underline-offset-4" href="/">Go to Home</a>
	</div>
{/if}
