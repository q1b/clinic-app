<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { isValidPhoneNumber } from 'libphonenumber-js';

	export let data: PageData;
	let phone_number = '';
	let isValidContact = true;
	$: isActiveUser = data.student?.id === data.user?.id;
	export let form: ActionData;
</script>

<pre>{JSON.stringify(form, null, 2)}</pre>

<div class="pt-12 px-4 pb-6">
	<div class="flex flex-col items-center justify-center gap-y-3 mb-12">
		<img
			class="w-32 h-32 rounded-full"
			src={data.student?.image}
			aria-hidden="true"
			alt={`Student ${data.student?.name} Image`}
		/>
		{#if isActiveUser}
			<button class="px-2 py-1 border"> upload image </button>
		{/if}
	</div>
	<form method="POST">
		<div class="flex flex-col mb-4">
			<label for="name" class="block text-sm font-medium leading-6 text-gray-900"> Name </label>
			<div class="mt-2">
				<input
					type="text"
					name="name"
					id="name"
					autocomplete="name"
					class="block w-full py-1.5 text-gray-900 shadow-sm"
					value={data.student?.name}
					readonly={!isActiveUser}
				/>
			</div>
		</div>
		<div class="flex flex-col mb-4">
			<label for="bio" class="block text-sm font-medium leading-6 text-gray-900"> Bio </label>
			<div class="mt-2">
				<textarea
					name="bio"
					id="bio"
					placeholder="Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente inventore, rerum ipsum et quia nisi odit quod, quaerat dolorum at deleniti sed ea qui iusto tempore. Ducimus suscipit nihil nisi?"
					class="block w-full py-1.5 text-gray-900 shadow-sm"
					readonly={!isActiveUser}
				/>
			</div>
		</div>
		<div class="flex flex-col mb-4">
			<label for="contact-number" class="block text-sm font-medium leading-6 text-gray-900">
				Contact Number
			</label>
			<div class="mt-2 flex flex-col gap-y-1">
				<input
					type="text"
					bind:value={phone_number}
					name="contact-number"
					id="contact-number"
					autocomplete="tel-national"
					class="block w-full py-1.5 text-gray-900 shadow-sm"
					class:border-rose-500={!isValidContact}
					on:focus={() => (isValidContact = true)}
					on:blur={() => (isValidContact = isValidPhoneNumber(phone_number, 'IN'))}
					readonly={!isActiveUser}
				/>
				{#if !isValidContact}
					<p class="text-sm text-rose-600">Enter a Valid Phone Number</p>
				{/if}
			</div>
		</div>
		<div class="flex flex-col mb-4">
			<label for="email-address" class="block text-sm font-medium leading-6 text-gray-900">
				Email Address
			</label>
			<div class="mt-2">
				<input
					type="text"
					name="email-address"
					id="email-address"
					autocomplete="email"
					tabindex="-1"
					class="block read-only:text-gray-700 read-only:bg-slate-50 w-full py-1.5 text-gray-900 shadow-sm"
					value={data.student?.email}
					readonly={true}
				/>
			</div>
		</div>
		{#if isActiveUser}
			<div class="mt-8">
				<button type="submit" class="px-2 py-1 bg-slate-400 text-white">Update</button>
			</div>
		{/if}
	</form>
</div>
