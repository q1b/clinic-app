
<script lang="ts">
	import { cn } from '$lib/utils';
	import { Temporal } from '@js-temporal/polyfill';

	let morning = true;

	const durations = [30, 45, 60] as const;
	let duration: keyof typeof durations = 30;

	let times = [] as Temporal.PlainTime[];
	let startTime = new Temporal.PlainTime(morning ? 6 : 12, 0, 0);
	let endTime = new Temporal.PlainTime(morning ? 12 : 20, 0, 0);

	let now = new Temporal.PlainTime(startTime.hour, startTime.minute);

	let selected: Temporal.PlainTime;
	let selected2: Temporal.PlainTime | undefined;

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
		startTime = new Temporal.PlainTime(morning ? 6 : 12, 0, 0);
		endTime = new Temporal.PlainTime(morning ? 12 : 20, 0, 0);
		now = new Temporal.PlainTime(startTime.hour, startTime.minute);
		for (let index = 0; index < times.length; index++) {
			times[index] = now;
			now = now.add({ minutes: 15 });
		}
	}

	$: regen(morning);
</script>

<div class="flex flex-col gap-y-1">
	<div class="flex gap-x-1">
		<button
			class={cn(
				'w-full border px-1 py-0.5 rounded-md',
				morning ? 'bg-slate-600 text-white' : 'bg-white text-slate-800'
			)}
			on:click={() => (morning = true)}
		>
			Morning
		</button>
		<button
			class={cn(
				'w-full border px-1 py-0.5 rounded-md',
				!morning ? 'bg-slate-600 text-white' : 'bg-white text-slate-800'
			)}
			on:click={() => (morning = false)}
		>
			Evening
		</button>
	</div>
	<div class="grid grid-cols-4 gap-1.5 p-1 shadow rounded-md">
		{#each times as time}
			<button
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
					selected === time || (selected2 && selected2.equals(time))
						? 'bg-blue-500 text-white'
						: 'hover:bg-slate-100 hover:text-slate-800 bg-slate-50 text-slate-700',
					selected2 && isBetween(time, selected, selected2) && 'bg-slate-200 text-slate-500'
				)}
			>
				{time.toLocaleString('en-us', {
					minute: '2-digit',
					hour: '2-digit',
					hour12: false
				})}
			</button>
		{/each}
	</div>
	<div class="grow items-center p-px mt-1 flex justify-between">
		{#each durations as dur}
			<button
				class={`px-2 py-px border rounded-md ${duration === dur && 'bg-blue-500 text-white'}`}
				on:click={() => (duration = dur)}
			>
				{dur} mins
			</button>
		{/each}
	</div>
</div>
