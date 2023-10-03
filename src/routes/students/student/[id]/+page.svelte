<script lang="ts">
	import { enhance } from '$app/forms';
	import { uploadImage, type InputChangeEvent } from '$lib/helpers/utils';
	import {
		Loader2Icon,
		LucideTextCursor,
		MousePointer2Icon,
		MousePointerIcon,
		UploadIcon,
		Wand2Icon
	} from 'lucide-svelte';
	import type { ActionData, PageData } from './$types';
	import Button from '$lib/components/ui/button/button.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	export let data: PageData;
	$: isActiveUser = data.student?.id === data.user?.id;
	export let form: ActionData;
	let imageState: 'Removing' | 'Syncing' | 'Uploading' | 'idle' = 'idle';

	async function handleImageUpload(e: InputChangeEvent) {
		console.log('Request to cloudinary has been sended!');
		imageState = 'Uploading';
		const res = await uploadImage(e);

		// deleting the previous image from cloudinary
		const regex = /\/v\d+\/([^/]+)\.\w{3,4}$/;
		const getPublicIdFromUrl = (cloudinaryUrl: string) => {
			const match = cloudinaryUrl.match(regex);
			return match ? match[1] : null;
		};

		if (data.student && data.student.image) {
			const publicID = getPublicIdFromUrl(data.student.image);
			console.log('Requesting Server to remove previous image with', publicID, ' as Public ID');
			if (publicID) {
				imageState = 'Removing';
				const res = await fetch('/profile-image', {
					method: 'DELETE',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ id: publicID })
				});
				console.log(res);
			} else {
				console.log('Maybe Google Profile Image');
			}
		}

		console.log('Request to Database has been sended!', res);
		if (data.student && data.user) {
			data.student.image = res.url;
			data.user.image = res.url;
		}
		imageState = 'Syncing';
		await fetch('/profile-image', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ userId: data.user?.id, url: res.url })
		});
		imageState = 'idle';
	}
	let loading = false;
</script>

<svelte:head>
	<title>{data.student?.name} Profile</title>
</svelte:head>

{#if form?.success}
	<p class="my-6 p-2 bg-green-400 text-white">Submitted Successfully</p>
{/if}

{#if imageState !== 'idle'}
	<p class="my-6 p-2 bg-green-400 text-white flex items-center gap-x-1">
		Your Image is {imageState}! <Loader2Icon class="inline animate-spin" />
	</p>
{/if}

<div class="pt-12 px-4 pb-6 w-full">
	<div class="flex flex-col items-center justify-center gap-y-3 mb-12">
		<img
			class="w-32 h-32 rounded-full"
			src={data.student?.image}
			aria-hidden="true"
			alt={`Student ${data.student?.name} Image`}
		/>
		{#if isActiveUser}
			<div class="flex items-center justify-center relative">
				<Label
					class="px-2 py-1 border rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-x-2"
					for="file-to-upload"
				>
					<UploadIcon class="p-px" /> Upload Image
				</Label>
				<input
					name="image"
					id="file-to-upload"
					type="file"
					hidden
					class="hidden"
					on:change={handleImageUpload}
				/>
			</div>
		{/if}
	</div>
	<form
		method="POST"
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				await update({ reset: false });
				loading = false;
			};
		}}
	>
		<div class="flex flex-col mb-4">
			<Label for="name" class="block text-sm font-medium leading-6 text-gray-900">Name</Label>
			<div class="mt-2">
				{#if isActiveUser}
					<Input type="text" name="name" id="name" autocomplete="name" value={data.student?.name} />
				{:else}
					<p class="text-xl -mt-1">
						{data.student?.name}
					</p>
				{/if}
			</div>
		</div>
		<div class="flex flex-col mb-4">
			<Label for="bio" class="block text-sm font-medium leading-6 text-gray-900">Bio</Label>
			<div class="mt-2">
				{#if isActiveUser}
					<Textarea
						name="bio"
						id="bio"
						placeholder="Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente inventore, rerum ipsum et quia nisi odit quod, quaerat dolorum at deleniti sed ea qui iusto tempore. Ducimus suscipit nihil nisi?"
						value={data.student?.bio}
					/>
				{:else}
					<p>
						{#if !!!data.student?.bio}
							---
						{/if}
						{data.student?.bio}
					</p>
				{/if}
			</div>
		</div>
		{#if isActiveUser || !!data.student?.phone_number}
			<div class="flex flex-col mb-4">
				<Label for="contact-number" class="block text-sm font-medium leading-6 text-gray-900">
					Contact Number
				</Label>
				<div class="mt-2 flex flex-col gap-y-1">
					{#if isActiveUser}
						<Input
							type="text"
							name="contact-number"
							id="contact-number"
							autocomplete="tel-national"
							class="block w-full py-1.5 text-gray-900 shadow-sm bg-slate-500/5 border-slate-400 focus:bg-white"
							value={data.student?.phone_number}
						/>
					{:else}
						<p>
							{data.student?.phone_number}
						</p>
					{/if}
					<!-- {#if !isValidContact}
						<p class="text-sm text-rose-600">Enter a Valid Phone Number</p>
					{/if} -->
				</div>
			</div>
		{/if}
		<div class="flex flex-col mb-4 w-full">
			<Label for="email-address" class="block text-sm font-medium leading-6 text-gray-900">
				Email Address
			</Label>
			<div class="grow overflow-x-auto flex">
				<div class="text-xl">
					{data.student?.email}
				</div>
			</div>
		</div>
		{#if isActiveUser}
			<div class="mt-8">
				<Button type="submit" class="gap-x-2">
					<span>Update</span>
					{#if loading}
						<Loader2Icon class="animate-spin" />
					{:else}
						<MousePointerIcon class="w-4 h-4" />
					{/if}
				</Button>
			</div>
		{/if}
	</form>
</div>
