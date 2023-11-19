<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import View from '$lib/components/slot-view.svelte';
	import Spinner from '$lib/components/spinner.svelte';
	import { ArrowRightCircleIcon, ArrowRightFromLineIcon, CheckCircleIcon } from 'lucide-svelte';
	import type { PageData } from './$types';
	import PhoneAuthDialog from './phoneAuthDialog.svelte';
	export let data: PageData;
	const osteopathUserId = data.user.id;
	const osteopathId = $page.params.id;

	let phoneDialogEl: HTMLDialogElement;
	let otp: 'idle' | 'sending' | 'sended' | 'verifying' | 'verified' | 'unverified' = 'idle';

	let currentForm: { name: 'idle' | 'phone' | 'otp' } = { name: 'idle' };
</script>

<!-- <pre>{JSON.stringify(data.by.dates, null, 2)}</pre> -->
<div class="flex flex-col items-center gap-y-12">
	<div
		class="flex items-center px-3 py-2 rounded-full w-max shadow-inner shadow-layer-5 border border-layer-6 gap-x-2"
	>
		<img src={data.user?.image} width={42} height={42} class="rounded-full" alt="" />
		<h3 class="text-lg">{data.user?.name}</h3>
	</div>
	<View
		bydates={data.by.dates}
		on:book={(e) => {
			phoneDialogEl.showModal();
		}}
	/>
</div>
<PhoneAuthDialog bind:el={phoneDialogEl} />
<!-- {#if phoneLaunge}
	<div
		class="w-64 h-72 absolute bg-black supports-backdrop-blur:backdrop-saturate-150 supports-backdrop-blur:backdrop-blur-sm supports-backdrop-blur:bg-layer-0/40"
	></div>
{/if} -->
