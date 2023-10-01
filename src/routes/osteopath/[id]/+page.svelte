<script lang="ts">
	import { days } from '$lib/modules/constants';
	import { Temporal } from '@js-temporal/polyfill';
	import type { PageData } from './$types';
	export let data: PageData;
	import groupBy from 'just-group-by';
	import { ClockIcon, MoreVerticalIcon, PlusCircleIcon, SettingsIcon } from 'lucide-svelte';
	import Dash from '$lib/components/Dash.svelte';
	// import { availability } from '$lib/server/db/schema';
	const time = new Temporal.PlainTime(9, 12);
	console.log(time.toString());
	const getTimeStr = (hour: number, minute: number) => {
		console.log('RUnning');
		return new Temporal.PlainTime(hour, minute).toLocaleString('en-us', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		});
	};
	const fromTimeStr = (str: string) => {
		const time = str.split(':');
		const hour = +time[0];
		const mins = +time[1];
		return new Temporal.PlainTime(hour, mins, 0);
	};
	let availability = [
		{
			id: 1,
			day: 'Sunday',
			startTime: getTimeStr(11, 0),
			endTime: getTimeStr(12, 15)
		},
		{
			id: 2,
			day: 'Sunday',
			startTime: getTimeStr(8, 0),
			endTime: getTimeStr(10, 15)
		},
		{
			id: 3,
			day: 'Monday',
			startTime: getTimeStr(9, 0),
			endTime: getTimeStr(5, 0)
		},
		{
			id: 4,
			day: 'Tuesday',
			startTime: getTimeStr(9, 0),
			endTime: getTimeStr(5, 0)
		},
		{
			id: 5,
			day: 'Wednesday',
			startTime: getTimeStr(9, 0),
			endTime: getTimeStr(5, 0)
		},
		{
			id: 6,
			day: 'Thrusday',
			startTime: getTimeStr(9, 0),
			endTime: getTimeStr(5, 0)
		},
		{
			id: 7,
			day: 'Friday',
			startTime: getTimeStr(9, 0),
			endTime: getTimeStr(5, 0)
		},
		{
			id: 7,
			day: 'Saturday',
			startTime: getTimeStr(9, 0),
			endTime: getTimeStr(5, 0)
		}
	];
	console.log(availability);
	const result = groupBy(availability, (i) => i.day);
	const keys = Object.keys(result);
	for (let index = 0; index < keys.length; index++) {
		const key = keys[index];
		result[key].sort((a, b) =>
			fromTimeStr(a.startTime).equals(fromTimeStr(b.startTime)) ? 1 : -1
		);
	}
	console.log(result);
	let loading = false;
</script>

<svelte:head>
	<title>{data.user?.name} Profile</title>
</svelte:head>

<div class="flex flex-col w-full items-center">
	<div class="flex flex-col gap-y-4 w-max">
		<h2 class="text-xl flex flex-wrap items-center gap-x-2">
			<span> <ClockIcon /> </span> Availability
		</h2>
		<div class="flex flex-col gap-y-2 pl-4 w-64">
			{#each Object.keys(result) as day, index}
				<div class="p-2 flex flex-col gap-y-2">
					<div class="flex justify-between gap-x-1">
						<div class="flex items-center gap-x-2">
							<Dash space={0} />
							<span class="flex items-center">{day}</span>
						</div>
						<div class="flex items-center gap-x-px">
							<div class="p-0.5 hover:bg-slate-100">
								<PlusCircleIcon size={20} />
							</div>
							<div class="p-0.5 hover:bg-slate-100">
								<SettingsIcon size={20} />
							</div>
						</div>
					</div>
					<ul class="flex flex-col gap-y-1 pl-6">
						{#each result[day] as { startTime, endTime }, i}
							<li class="flex gap-x-1 items-center justify-between w-full">
								<div class="flex items-center gap-x-0.5">
									<label for="{day}-start-time-{i}" class="flex items-center relative">
										<div class="tabular-nums">
											{startTime}
										</div>
									</label>
									<Dash />
									<label for="{day}-end-time-{i}" class="flex items-center relative">
										<div class="tabular-nums">
											{endTime}
										</div>
									</label>
									<!-- <button class="tabular-nums inline-flex gap-x-1 px-2 py-1 border">
									{startTime}
									<ChevronDownIcon />
								</button> -->
								</div>
								<button class="p-0.5 hover:bg-slate-100 rounded-sm">
									<MoreVerticalIcon size={20} />
								</button>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>
</div>
