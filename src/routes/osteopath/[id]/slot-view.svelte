<script lang="ts">
	import { Temporal } from '@js-temporal/polyfill';
	import Dash from '$lib/components/dash.svelte';
	import { fly } from 'svelte/transition';
	import { quintInOut } from 'svelte/easing';
	import { ArrowRightCircleIcon } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{
		book: {
			duration: '30' | '45' | '60';
			id: string;
			date: string;
			startTime: string;
		};
	}>();

	const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

	export let bydates: Record<
		string,
		{
			duration: '30' | '45' | '60';
			id: string;
			date: string;
			startTime: string;
			osteopathId: string;
			userId: string | null;
		}[]
	>;
	const [year, month, day] = Object.keys(bydates)[0]
		.split('-')
		.map((v) => +`${v}`);

	const today = new Temporal.PlainDate(year, month, day);

	export let selected = new Temporal.PlainDate(today.year, today.month, today.day);

	let selectedTimeslot: {
		id: string;
		date: string;
		startTime: string;
		duration: '30' | '45' | '60';
	} | null = null;

	let min = new Temporal.PlainDate(today.year, today.month, today.day);
	let max = new Temporal.PlainDate(today.year, today.month + 1, today.day);

	let view = {
		weeks: [[], [], [], [], [], []],
		date: new Temporal.PlainYearMonth(selected.year, selected.month)
	} as {
		weeks: { day: Temporal.PlainDate; disabled: boolean }[][];
		date: Temporal.PlainYearMonth;
	};

	$: header = new Temporal.PlainDate(view.date.year, view.date.month, 1).toLocaleString('en-us', {
		month: 'long',
		year: 'numeric'
	});

	let firstDayOfMonth: Temporal.PlainDate;
	let starting_point: Temporal.PlainDate;
	firstDayOfMonth = new Temporal.PlainDate(view.date.year, view.date.month, 1);

	if (firstDayOfMonth.dayOfWeek === 7) {
		starting_point = new Temporal.PlainDate(view.date.year, view.date.month, 1);
	} else {
		starting_point = new Temporal.PlainDate(view.date.year, view.date.month, 1).subtract({
			days: firstDayOfMonth.dayOfWeek
		});
	}

	for (let week = 0; week < 6; week++) {
		for (let index = 0; index < 7; index++) {
			const disabled = bydates[starting_point.toString()] ? false : true;
			view.weeks[week]?.push({ day: starting_point, disabled });
			starting_point = starting_point.add({ days: 1 });
		}
	}

	const invalidateView = () => {
		firstDayOfMonth = new Temporal.PlainDate(view.date.year, view.date.month, 1);
		if (firstDayOfMonth.dayOfWeek === 7) {
			starting_point = new Temporal.PlainDate(view.date.year, view.date.month, 1);
		} else {
			starting_point = new Temporal.PlainDate(view.date.year, view.date.month, 1).subtract({
				days: firstDayOfMonth.dayOfWeek
			});
		}
		for (let week = 0; week < 6; week++) {
			for (let index = 0; index < 7; index++) {
				const disabled = bydates[starting_point.toString()] ? false : true;
				view.weeks[week][index] = { day: starting_point, disabled };
				starting_point = starting_point.add({ days: 1 });
			}
		}
	};

	const nextMonth = () => {
		view.date = view.date.add({ months: 1 });
		invalidateView();
	};

	const prevMonth = () => {
		view.date = view.date.subtract({ months: 1 });
		invalidateView();
	};
</script>

<div class="flex flex-col sm:flex-row relative">
	<div
		class="p-2 xs:p-3 sm:p-4 border-l-2 border-r-2 border-t-2 rounded-t-lg sm:border-r-0 sm:border-b-2 sm:rounded-tr-none sm:rounded-l-lg h-full w-full border-layer-5"
	>
		<div class="flex items-center justify-between mb-4">
			<span class="text-lg font-bold">
				{header}
			</span>
			<div class="flex items-center gap-x-4">
				<button
					class="p-1 text-layer-11 disabled:text-layer-7 hover:bg-layer-3 rounded-md"
					on:click={() => prevMonth()}
					disabled={view.date.since(min).sign === 0}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2.5"
						stroke="currentColor"
						class="w-5 h-5"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
					</svg>
				</button>
				<button
					disabled={view.date.until(max).sign === 0}
					class="p-1 -m-1 text-layer-11 disabled:text-layer-7 hover:bg-layer-3 rounded-md"
					on:click={() => nextMonth()}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2.5"
						stroke="currentColor"
						class="w-5 h-5"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
					</svg>
				</button>
			</div>
		</div>
		<div role="grid" class="flex w-full flex-col gap-y-1">
			<div
				role="row"
				class="grid grid-cols-7 place-content-center gap-x-1 xs:gap-x-2 sm:gap-x-4 mb-2"
			>
				{#each days as day}
					<div role="columnheader" class="flex items-center justify-center uppercase">
						{day[0] + day[1] + day[2]}
					</div>
				{/each}
			</div>
			<div role="rowgroup" class="flex w-full flex-col rounded-md gap-0.5">
				{#each view.weeks as week}
					<div role="row" class="flex items-center gap-1 xs:gap-2 sm:gap-4">
						{#each week as { day, disabled }}
							<button
								type="button"
								role="gridcell"
								class="flex w-full items-center justify-center p-1 xs:p-1.5 sm:p-2
								text-layer-11 border border-layer-6
								bg-layer-4 hover:bg-layer-6 rounded-md
								disabled:border-transparent
								disabled:!bg-transparent
								disabled:!text-layer-7
								aria-selected:bg-layer-13
								aria-selected:text-layer-0
								aria-selected:border-transparent
							"
								aria-selected={selected.equals(day)}
								disabled={disabled || view.date.month !== day.month || day.since(min).sign === -1}
								on:click={() => {
									if (selected !== day) selectedTimeslot = null;
									selected = day;
								}}
							>
								<time
									datetime={day.toString()}
									class="flex items-center justify-center tabular-nums w-7 h-7"
								>
									{day.toLocaleString('en-us', { day: '2-digit' })}
								</time>
							</button>
						{/each}
					</div>
				{/each}
			</div>
		</div>
	</div>
	<div
		class="p-2 xs:p-3 sm:p-4 border-2 border-layer-6 rounded-b-lg sm:rounded-bl-none sm:rounded-r-lg"
	>
		<h4 class="whitespace-nowrap text-lg font-bold tabular-nums mb-3">
			{selected
				.toLocaleString('en-us', {
					day: 'numeric',
					weekday: 'short'
				})
				.split(' ')
				.reverse()
				.join(' ')}
		</h4>
		<ul class="flex flex-col gap-y-2">
			{#if bydates[selected.toString()]}
				{#each bydates[selected.toString()] as { id, date, startTime, duration }}
					{@const [hour, minute] = startTime?.split(':').map((v) => +v)}
					{@const formattedStartTime = new Temporal.PlainTime(hour, minute).toLocaleString(
						'en-us',
						{
							hour: '2-digit',
							minute: '2-digit'
						}
					)}
					{@const formattedEndAt = new Temporal.PlainTime(hour, minute)
						.add({
							minutes: +`${duration}`
						})
						.toLocaleString('en-us', {
							hour: '2-digit',
							minute: '2-digit'
						})}
					<li class="">
						<button
							aria-pressed={selectedTimeslot?.id === id}
							on:click={() => {
								selectedTimeslot = {
									id,
									date,
									startTime,
									duration
								};
							}}
							class="flex group
							aria-pressed:bg-layer-13
							aria-pressed:text-layer-0 items-center gap-x-1 px-1.5 py-0.5
							bg-layer-3 rounded-md"
						>
							<span class="whitespace-nowrap tabular-nums">{formattedStartTime}</span>
							<Dash class="bg-layer-6 group-aria-pressed:bg-layer-0" />
							<span class="whitespace-nowrap tabular-nums">{formattedEndAt}</span>
						</button>
					</li>
				{/each}
			{/if}
		</ul>
	</div>
	<div class="absolute right-4 bottom-4">
		{#if selectedTimeslot?.id}
			<button
				class="inline-flex gap-x-1 items-center bg-layer-6 hover:bg-layer-7 rounded-md px-2 py-1"
				on:click={() => {
					if (selectedTimeslot?.id) dispatch('book', selectedTimeslot);
				}}
				transition:fly={{
					delay: 50,
					duration: 300,
					y: 10,
					opacity: 0,
					easing: quintInOut
				}}
			>
				Book <ArrowRightCircleIcon class="w-4 h-4" />
			</button>
		{/if}
	</div>
</div>
