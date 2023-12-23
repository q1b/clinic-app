<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import ImageUpload from './image-upload.svelte';
	import { SaveIcon } from 'lucide-svelte';
	import type { PageData } from './$types';
	import { states } from './constants';
	import * as Avatar from '$lib/components/ui/avatar';
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
</script>

<div
	class="bg-layer-2 shadow-sm shadow-layer-6 ring-1 ring-layer-3/5 rounded-xl w-full max-w-lg mb-10"
>
	<div class="px-4 py-6 sm:p-8">
		<h2 class="text-base font-semibold leading-7 text-layer-12">Avatar Image</h2>
		<p class="mt-1 text-sm leading-6 text-layer-11 mb-4">
			This Avatar image is used to show your profile picture in the app.
		</p>
		<div class="flex flex-col items-center justify-center gap-y-4">
			<Avatar.Root class="w-24 h-24">
				<Avatar.Image src={data.user?.image} alt="@{data.user?.name}" />
				<Avatar.Fallback>
					{data.user?.name?.at(0) ?? 'C' + data.user?.name?.at(1) ?? 'N'}
				</Avatar.Fallback>
			</Avatar.Root>
			<ImageUpload
				imageSrc={data.user?.image}
				setImageSrc={(src) => {
					data.user && (data.user.image = src);
				}}
			/>
		</div>
	</div>
</div>

<form
	method="POST"
	action="?/profile"
	class="bg-layer-2 shadow-sm shadow-layer-6 ring-1 ring-layer-3/5 rounded-xl w-full max-w-lg"
>
	<input name="user_id" type="hidden" value={data.user?.id} />
	<div class="px-4 py-6 sm:p-8">
		<div class="mb-8">
			<h2 class="text-base font-semibold leading-7 text-layer-12">Profile</h2>
			<p class="mt-1 text-sm leading-6 text-layer-11">
				This information will be displayed publicly so be careful what you share.
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
						value={data.user?.name ?? ''}
					/>
				</div>
			</div>
			<div class="">
				<label for="username" class="block text-sm font-medium leading-6 text-layer-12">
					Username
				</label>
				<div class="mt-2">
					<div
						class="flex rounded-md shadow-sm bg-layer-3 hover:bg-layer-3/50 ring-1 ring-inset ring-layer-9 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600"
					>
						<span class="flex select-none items-center pl-3 text-layer-11 sm:text-sm">
							website.com/
						</span>
						<input
							type="text"
							name="username"
							id="username"
							autocomplete="username"
							class="block flex-1 border-0 bg-transparent py-1.5 pl-1 caret-layer-13 text-layer-13 placeholder:text-layer-10 focus:ring-0 sm:text-sm sm:leading-6"
							value={data.user?.username ?? ''}
							placeholder="karan"
						/>
					</div>
				</div>
			</div>
			<div class="">
				<label for="bio" class="block text-sm font-medium leading-6 text-layer-12"> About </label>
				<div class="mt-2">
					<!-- <textarea id="about" name="about" rows="3" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></textarea> -->
					<textarea
						name="bio"
						id="bio"
						rows="3"
						class="block w-full rounded-md border-0 bg-layer-3 hover:bg-layer-3/50 focus:bg-layer-2 py-1.5 text-layer-12 shadow-sm ring-1 ring-inset ring-layer-9 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
						>{data.user?.bio ?? ''}</textarea
					>
					<p class="mt-3 text-sm leading-6 text-layer-10">Write a few sentences about yourself.</p>
				</div>
			</div>
		</div>
	</div>
	<div class="flex items-center justify-between gap-x-6 border-t border-layer-7 px-4 py-4 sm:px-8">
		<Button type="submit" icon={SaveIcon}><span class="h-[18px]">Save</span></Button>
	</div>
</form>

<form
	method="POST"
	action="?/personal"
	class="mt-8 bg-layer-2 shadow-sm shadow-layer-6 ring-1 ring-layer-3/5 rounded-xl w-full max-w-lg"
>
	<input name="user_id" type="hidden" value={data.user?.id} />
	<div class="px-4 py-6 sm:p-8">
		<div class="mb-8">
			<h2 class="text-base font-semibold leading-7 text-layer-12">Personal Information</h2>
			<p class="mt-1 text-sm leading-6 text-layer-11">Address</p>
		</div>
		<div class="flex flex-col gap-x-6 gap-y-6">
			<div class="">
				<label for="state" class="block text-sm font-medium leading-6 text-layer-12"> State </label>
				<div class="mt-2">
					<select
						id="state"
						name="state"
						autocomplete="state-name"
						class="block w-full rounded-md border-0 bg-layer-3 hover:bg-layer-3/50 focus:bg-layer-2 py-1.5 text-layer-12 shadow-sm ring-1 ring-inset ring-layer-9 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
						value={data.user?.state ?? 'default'}
					>
						<option value="default" disabled selected> -- select an option -- </option>
						{#each states as state}
							<option value={state}>{state}</option>
						{/each}
					</select>
				</div>
			</div>
		</div>
	</div>
	<div class="flex items-center justify-between gap-x-6 border-t border-layer-7 px-4 py-4 sm:px-8">
		<Button type="submit" icon={SaveIcon}><span class="h-[18px]">Save</span></Button>
	</div>
</form>

<div
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
</div>
