<script lang="ts">
	import { page } from '$app/stores';
	import View from './slot-view-edit.svelte';
	import type { PageData } from './$types';
	import { ArrowLeftCircleIcon, ArrowRightCircleIcon, Edit } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { getNums } from '../utilts';
	import { Temporal } from '@js-temporal/polyfill';

	export let data: PageData;

	$: data?.osteopathUser?.id !== data?.user?.id && browser && goto(`/osteopath/${$page.params.id}`);
	$: osteopathId = $page?.params?.id;
</script>

<div class="flex flex-col items-center gap-y-12">
	<View
		bydates={data.by.dates}
		on:book={async (e) => {
			const response = await fetch(`/osteopath/${osteopathId}/api/`, {
				method: 'POST',
				body: JSON.stringify({
					...e.detail,
					osteopathUserId: data?.osteopathUser?.id,
					userId: data?.user?.id,
					osteopathId
				}),
				headers: {
					'content-type': 'application/json'
				}
			});
			console.log(await response.json());
		}}
	/>
	{#await data.streamed.data}
		... Loading
	{:then appointments}
		{#each appointments as appointment}
			{@const [hour, minute] = getNums(appointment.startTime, ':')}
			{@const formattedEndAt = new Temporal.PlainTime(hour, minute)
				.add({
					minutes: +`${appointment.duration}`
				})
				.toLocaleString('en-us', {
					hour: '2-digit',
					minute: '2-digit',
					hourCycle: 'h24'
				})}
			<div>
				<div>
					{appointment.user.name}
				</div>
				<span>{appointment.date}</span>
				<div>
					{appointment.startTime} - {formattedEndAt}
				</div>
			</div>
		{/each}
	{/await}
	<!-- svelte-ignore missing-declaration -->
	<a
		href="/osteopath/{osteopathId}"
		class="flex items-center pl-4 pr-3 py-2 rounded-full w-max shadow-inner shadow-layer-5 border border-layer-6 group hover:scale-95 transition-all"
	>
		<ArrowLeftCircleIcon
			class="group-hover:translate-x-0.5 group-active:-translate-x-1 transition-transform "
		/>
		<span class="mr-2 ml-1 text-xl scale-105 transition-transform group-hover:scale-100 mt-0.5">
			Back
		</span>
	</a>
</div>
