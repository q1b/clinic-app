<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { SaveIcon } from 'lucide-svelte';
	import type { PageData } from './$types';
	const states = [
		'Andhra Pradesh',
		'Arunachal Pradesh',
		'Assam',
		'Bihar',
		'Chhattisgarh',
		'Goa',
		'Gujarat',
		'Haryana',
		'Himachal Pradesh',
		'Jammu and Kashmir',
		'Jharkhand',
		'Karnataka',
		'Kerala',
		'Madhya Pradesh',
		'Maharashtra',
		'Manipur',
		'Meghalaya',
		'Mizoram',
		'Nagaland',
		'Odisha',
		'Punjab',
		'Rajasthan',
		'Sikkim',
		'Tamil Nadu',
		'Telangana',
		'Tripura',
		'Uttar Pradesh',
		'Uttarakhand',
		'West Bengal'
	];
	export let data: PageData;
	$: keys = {
		sms: {
			label: 'Phone Number',
			value: data.user?.phone_number
		},
		google: {
			label: 'Google Account',
			value: data.user?.email
		}
	};
	// data.user.
</script>

<form class="bg-layer-2 shadow-sm shadow-layer-6 ring-1 ring-layer-3/5 rounded-xl w-full max-w-lg">
	<div class="px-4 py-6 sm:p-8">
		<div class="mb-8">
			<h2 class="text-base font-semibold leading-7 text-layer-12">Personal Information</h2>
			<p class="mt-1 text-sm leading-6 text-layer-11">
				Use a permanent address where you can receive mail.
			</p>
		</div>
		<div class="flex flex-col gap-x-6 gap-y-6">
			<div class="">
				<label for="full-name" class="block text-sm font-medium leading-6 text-layer-12">
					Full Name
				</label>
				<div class="mt-2">
					<input
						type="text"
						name="full-name"
						id="full-name"
						autocomplete="family-name"
						class="block w-full rounded-md border-0 bg-layer-3 hover:bg-layer-3/50 focus:bg-layer-2 py-1.5 text-layer-12 shadow-sm ring-1 ring-inset ring-layer-9 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
						value={data.user?.name}
					/>
				</div>
			</div>
			<div class="">
				<label for="state" class="block text-sm font-medium leading-6 text-layer-12"> State </label>
				<div class="mt-2">
					<select
						id="state"
						name="state"
						autocomplete="state-name"
						class="block w-full rounded-md border-0 bg-layer-3 hover:bg-layer-3/50 focus:bg-layer-2 py-1.5 text-layer-12 shadow-sm ring-1 ring-inset ring-layer-9 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
					>
						<option disabled selected value> -- select an option -- </option>
						{#each states as state}
							<option>{state}</option>
						{/each}
					</select>
				</div>
			</div>
		</div>
	</div>
	<div class="flex items-center justify-between gap-x-6 border-t border-layer-7 px-4 py-4 sm:px-8">
		<Button icon={SaveIcon}><span class="h-[18px]">Save</span></Button>
	</div>
</form>

<form
	class="bg-layer-2 shadow-sm shadow-layer-6 ring-1 ring-layer-3/5 rounded-xl w-full max-w-lg mt-8"
>
	<div class="px-4 py-6 sm:p-8">
		<div class="mb-6">
			<h2 class="text-base font-semibold leading-7 text-layer-12">Account Credentials</h2>
		</div>
		<div class="flex flex-col gap-x-6 gap-y-8">
			{#each data.keys as key}
				{@const { value, label } = keys[key.providerId]}
				<div class="">
					<span class="block text-sm font-medium leading-6 text-layer-12"> {label} </span>
					<div class="mt-2">
						<div
							id="phone-number"
							class="form-input block w-full rounded-md border-0 bg-layer-2 py-1.5 text-layer-11 shadow-sm ring-1 ring-inset ring-layer-9 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
						>
							{value}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</form>
