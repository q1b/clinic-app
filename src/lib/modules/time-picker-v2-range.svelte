<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/helpers/utils';
	import { Temporal } from '@js-temporal/polyfill';
	import { Loader2Icon } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { handleAdd, handleUpdate } from '../../routes/(api)/time-availability';
	// props related to API Request Specifically!
	export let method: 'add' | 'update' = 'update';
	export let time_availability_id: string | undefined = undefined;
	export let osteopathId: string | undefined = undefined;
	export let day: string | undefined = undefined;

	const dispatch = createEventDispatcher();

	let times = [] as Temporal.PlainTime[];

	let startTime = new Temporal.PlainTime(7, 0, 0);
	let endTime = new Temporal.PlainTime(18, 0, 0);

	let now = new Temporal.PlainTime(startTime.hour, startTime.minute);

	export let selected: Temporal.PlainTime;
	export let selected2: Temporal.PlainTime | undefined;

	function isBetween(time: Temporal.PlainTime, start: Temporal.PlainTime, end: Temporal.PlainTime) {
		return (
			(time.since(start).sign === 1 && time.until(end).sign === 1) ||
			(time.since(end).sign === 1 && time.until(start).sign === 1)
		);
	}

	while (!now.equals(endTime)) {
		times.push(now);
		now = now.add({ minutes: 15 });
	}
	let loading = false;
</script>

<div class="grid grid-cols-4 gap-1 pt-32 overflow-y-scroll pb-1 px-1 grow h-0 place-content-center">
	{#each times as time}
		<button
			type="button"
			on:click={() => {
				if (selected === undefined) selected = time;
				else if (selected2 === undefined) selected2 = time;
				else {
					selected2 = undefined;
					selected = time;
				}
			}}
			class={cn(
				`px-1 text-base cursor-pointer rounded tabular-nums flex items-center justify-center border`,
				selected.equals(time) || (selected2 && selected2.equals(time))
					? 'bg-blue-500 text-white'
					: 'hover:bg-slate-100 hover:text-slate-800 bg-slate-50 text-slate-700',
				selected2 && isBetween(time, selected, selected2) && 'bg-slate-200 text-slate-500'
			)}
		>
			{time.toLocaleString('en-us', {
				hour: '2-digit',
				minute: '2-digit',
				hour12: false
			})}
		</button>
	{/each}
</div>

<div class="flex gap-x-2">
	<Button class="w-full" variant="outline">Cancel</Button>
	{#if method === 'update'}
		<Button
			disabled={loading}
			on:click={async () => {
				if (!selected2) return;
				let reverse = selected.until(selected2).sign === 1;
				const startTime = (reverse ? selected : selected2).toLocaleString('en-us', {
					hour: '2-digit',
					minute: '2-digit',
					hour12: false
				});
				const endTime = (reverse ? selected2 : selected).toLocaleString('en-us', {
					hour: '2-digit',
					minute: '2-digit',
					hour12: false
				});
				if (time_availability_id) {
					loading = true;
					await handleUpdate({
						id: time_availability_id,
						startTime,
						endTime
					});
					loading = false;
				}
				dispatch('load', { startTime, endTime });
			}}
			class="w-full"
		>
			{#if loading}
				<Loader2Icon class="animate-spin" />
			{/if}
			Update
		</Button>
	{:else}
		<Button
			disabled={loading}
			on:click={async () => {
				if (!selected2) return;
				let reverse = selected.until(selected2).sign === 1;
				const startTime = (reverse ? selected : selected2).toLocaleString('en-us', {
					hour: '2-digit',
					minute: '2-digit',
					hour12: false
				});
				const endTime = (reverse ? selected2 : selected).toLocaleString('en-us', {
					hour: '2-digit',
					minute: '2-digit',
					hour12: false
				});
				if (day && osteopathId) {
					loading = true;
					const res = await handleAdd({
						day,
						osteopathId,
						startTime,
						endTime
					});
					dispatch('load', res.data);
					loading = false;
				}
			}}
			class="w-full"
		>
			{#if loading}
				<Loader2Icon class="animate-spin" />
			{/if}
			Add
		</Button>
	{/if}
</div>
