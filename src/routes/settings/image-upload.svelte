<script lang="ts">
	import { uploadImage, type InputChangeEvent } from '$lib/utils/upload';
	import { page } from '$app/stores';
	import { Loader2Icon, UploadIcon } from 'lucide-svelte';
	import * as Avatar from '$lib/components/ui/avatar';

	let imageState: 'Removing' | 'Syncing' | 'Uploading' | 'idle' = 'idle';
	let { setImage, getImage } = $props();

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

		if ($page.data.user && $page.data.user.image) {
			const publicID = getPublicIdFromUrl($page.data.user.image);
			console.log('Requesting Server to remove previous image with', publicID, ' as Public ID');
			if (publicID) {
				imageState = 'Removing';
				const res = await fetch('/image', {
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
		if ($page.data && $page.data.user) {
			$page.data.user.image = res.url;
			imageState = 'Syncing';
			await fetch('/image', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId: $page.data.user?.id, url: res.url })
			});
			imageState = 'idle';
		}
	}
	console.log($page.data);
</script>

{#if imageState !== 'idle'}
	<p class="my-6 p-2 bg-green-400 text-white flex items-center gap-x-1">
		Your Image is {imageState}! <Loader2Icon class="inline animate-spin" />
	</p>
{/if}

<div class="flex flex-col items-center justify-center gap-y-4">
	<Avatar.Root class="w-24 h-24">
		<Avatar.Image src={$page.data.user?.image} alt="@{$page.data.user?.name}" />
		<Avatar.Fallback>
			{$page.data.user?.name?.at(0) ?? 'C' + $page.data.user?.name?.at(1) ?? 'N'}
		</Avatar.Fallback>
	</Avatar.Root>
	<div class="">
		<label
			class="px-2 py-1 border border-layer-6 rounded-md bg-layer-2 hover:bg-layer-1 cursor-pointer flex items-center gap-x-2 w-max transition-colors"
			for="file-to-upload"
		>
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
</div>
