<script lang="ts">
	import { days } from './DatePicker/utils';
	import { Temporal } from '@js-temporal/polyfill';

	const today = Temporal.Now.plainDateISO();

	export let selected = new Temporal.PlainDate(today.year, today.month, today.day);
	let selected2: Temporal.PlainDate | undefined;

	let min = new Temporal.PlainDate(today.year, today.month, today.day);
	let max = new Temporal.PlainDate(today.year, today.month + 2, today.day);

	let view = {
		weeks: [[], [], [], [], [], []],
		date: new Temporal.PlainYearMonth(selected.year, selected.month)
	} as {
		weeks: Temporal.PlainDate[][];
		date: Temporal.PlainYearMonth;
	};

	$: header = new Temporal.PlainDate(view.date.year, view.date.month, 1).toLocaleString('en-us', {
		month: 'long',
		year: 'numeric'
	});

	function isBetween(date: Temporal.PlainDate, start: Temporal.PlainDate, end: Temporal.PlainDate) {
		return (
			(date.since(start).sign === 1 && date.until(end).sign === 1) ||
			(date.since(end).sign === 1 && date.until(start).sign === 1)
		);
	}

	$: {
		console.log(
			selected.day,
			selected2?.day,
			selected2 && isBetween(today.add({ days: 3 }), selected, selected2)
		);
	}

	let firstDayOfMonth = new Temporal.PlainDate(view.date.year, view.date.month, 1);
	let starting_point: Temporal.PlainDate;
	if (firstDayOfMonth.dayOfWeek === 7) {
		starting_point = new Temporal.PlainDate(view.date.year, view.date.month, 1);
	} else {
		starting_point = new Temporal.PlainDate(view.date.year, view.date.month, 1).subtract({
			days: firstDayOfMonth.dayOfWeek
		});
	}
	for (let week = 0; week < 6; week++) {
		for (let index = 0; index < 7; index++) {
			view.weeks[week]?.push(starting_point);
			starting_point = starting_point.add({ days: 1 });
		}
	}

	const nextMonth = () => {
		view.date = view.date.add({ months: 1 });
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
				view.weeks[week][index] = starting_point;
				starting_point = starting_point.add({ days: 1 });
			}
		}
	};
	const prevMonth = () => {
		view.date = view.date.subtract({ months: 1 });
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
				view.weeks[week][index] = starting_point;
				starting_point = starting_point.add({ days: 1 });
			}
		}
	};
</script>

<div class="w-max p-2 border rounded-lg h-full">
	<div class="w-full flex items-center justify-between mb-2">
		<button
			class="p-1 text-slate-500 disabled:text-slate-300 hover:bg-slate-100 rounded-md"
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
		<span class="text-lg">
			{header}
		</span>
		<button
			disabled={view.date.until(max).sign === 0}
			class="p-1 text-slate-500 disabled:text-slate-300 hover:bg-slate-100 rounded-md"
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
	<div role="grid" class="flex flex-col gap-y-1">
		<div role="row" class="grid grid-cols-7 place-content-center">
			{#each days as day, i}
				<div role="columnheader" class="flex items-center justify-center">
					{day[0]}
				</div>
			{/each}
		</div>
		<div role="rowgroup" class="flex flex-col rounded-md gap-px">
			{#each view.weeks as week}
				<div role="row" class="flex items-center justify-center gap-px">
					{#each week as day}
						<button
							type="button"
							role="gridcell"
							class="flex items-center justify-center p-px text-slate-800 hover:bg-slate-200 rounded-md disabled:text-slate-400 aria-selected:bg-blue-500 aria-selected:text-white"
							class:text-rose-500={selected2 && isBetween(day, selected, selected2)}
							aria-selected={selected.equals(day) || (selected2 && selected2.equals(day))}
							disabled={view.date.month !== day.month || day.since(min).sign === -1}
							on:click={() => {
								if (selected === undefined) selected = day;
								else if (selected2 === undefined) selected2 = day;
								else {
									selected2 = undefined;
									selected = day;
								}
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
