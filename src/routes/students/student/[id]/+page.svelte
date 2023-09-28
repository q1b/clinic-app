<script lang="ts">
	import { enhance } from '$app/forms';
	import { uploadImage, type InputChangeEvent } from '$lib/helpers/utils';
	import { Loader2Icon, UploadIcon } from 'lucide-svelte';
	import type { ActionData, PageData } from './$types';

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

<div class="pt-12 px-4 pb-6">
	<div class="flex flex-col items-center justify-center gap-y-3 mb-12">
		<img
			class="w-32 h-32 rounded-full"
			src={data.student?.image}
			aria-hidden="true"
			alt={`Student ${data.student?.name} Image`}
		/>
		{#if isActiveUser}
			<div class="flex items-center justify-center relative">
				<label class="px-2 py-1 border flex items-center gap-x-2" for="file-to-upload">
					<UploadIcon class="p-px" /> Upload Image
				</label>
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
			return ({ update }) => update({ reset: false });
		}}
	>
		<div class="flex flex-col mb-4">
			<label for="name" class="block text-sm font-medium leading-6 text-gray-900"> Name </label>
			<div class="mt-2">
				<input
					type="text"
					name="name"
					id="name"
					autocomplete="name"
					class="block w-full py-1.5 text-gray-900 shadow-sm bg-slate-500/5 border-slate-400 focus:bg-white"
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
					class="block w-full py-1.5 text-gray-900 shadow-sm bg-slate-500/5 border-slate-400 focus:bg-white"
					value={data.student?.bio}
					readonly={!isActiveUser}
				/>
			</div>
		</div>
		{#if isActiveUser || !!data.student?.phone_number}
			<div class="flex flex-col mb-4">
				<label for="contact-number" class="block text-sm font-medium leading-6 text-gray-900">
					Contact Number
				</label>
				<div class="mt-2 flex flex-col gap-y-1">
					<input
						type="text"
						name="contact-number"
						id="contact-number"
						autocomplete="tel-national"
						class="block w-full py-1.5 text-gray-900 shadow-sm bg-slate-500/5 border-slate-400 focus:bg-white"
						readonly={!isActiveUser}
						value={data.student?.phone_number}
					/>
					<!-- {#if !isValidContact}
						<p class="text-sm text-rose-600">Enter a Valid Phone Number</p>
					{/if} -->
				</div>
			</div>
		{/if}

		<div class="flex flex-col mb-4">
			<label for="email-address" class="block text-sm font-medium leading-6 text-gray-900">
				Email Address
			</label>
			<div class="mt-2">
				<div class="form-input text-slate-800 bg-slate-100 border-slate-400">
					{data.student?.email}
				</div>
			</div>
		</div>
		{#if isActiveUser}
			<div class="mt-8">
				<button type="submit" class="px-2 py-1 disabled:bg-slate-300 bg-slate-500 text-white"
					>Update</button
				>
			</div>
		{/if}
	</form>
</div>
