<script lang="ts">
	import { cn } from '$lib/helpers/utils';
	import { Temporal } from '@js-temporal/polyfill';

	let morning = true;

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
	function regen(morning: boolean) {
		startTime = new Temporal.PlainTime(morning ? 7 : 12, 0, 0);
		endTime = new Temporal.PlainTime(morning ? 12 : 18, 0, 0);
		now = new Temporal.PlainTime(startTime.hour, startTime.minute);
		for (let index = 0; index < times.length; index++) {
			times[index] = now;
			now = now.add({ minutes: 15 });
		}
	}

	$: regen(morning);
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
