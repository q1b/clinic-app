<script lang="ts">
	// import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	import * as Popover from '$lib/components/ui/popover';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Temporal } from '@js-temporal/polyfill';
	import type { PageData } from './$types';
	import groupBy from 'just-group-by';
	import { ClockIcon, DeleteIcon, Edit3, PlusCircleIcon, SettingsIcon } from 'lucide-svelte';
	import Dash from '$lib/components/Dash.svelte';
	import TimePickerV2Range from '$lib/modules/time-picker-v2-range.svelte';
	import { handleDelete } from '../../../(api)/time-availability';
	const time = new Temporal.PlainTime(9, 12);
	console.log(time.toString());
	const getTimeStr = (hour: number, minute: number) => {
		return new Temporal.PlainTime(hour, minute).toLocaleString('en-us', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		});
	};
	const fromTimeStr = (str: string) => {
		if (str.includes('AM') || str.includes('PM')) {
			const [timeA, dayTime] = str.split(' ');
			const time = timeA.split(':');
			let hour = +time[0];
			let mins = +time[1];
			if (dayTime === 'PM') hour += 12;
			return new Temporal.PlainTime(hour, mins, 0);
		}
		const time = str.split(':');
		const hour = +time[0];
		const mins = +time[1];
		return new Temporal.PlainTime(hour, mins, 0);
	};
	export let data: PageData;

	let availability = data.osteopath?.availability;

	const keys = [
		'sunday',
		'monday',
		'tuesday',
		'wednesday',
		'thursday',
		'friday',
		'saturday'
	] as const;

	function getGroupedByDate() {
		const grouped = groupBy(
			availability as {
				id: string;
				osteopathId: string;
				day: 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'friday' | 'thursday' | 'saturday';
				startTime: string;
				endTime: string;
			}[],
			(i) => (i.day !== null ? i.day : 'sunday')
		);
		for (let index = 0; index < keys.length; index++) {
			const key = keys[index];
			grouped[key].sort((a, b) => fromTimeStr(a.startTime).since(fromTimeStr(b.startTime)).sign);
		}
		return grouped;
	}
	let result = getGroupedByDate();
</script>

<svelte:head>
	<title>{data.osteopath.name} Profile</title>
</svelte:head>

<div class="flex flex-col w-full mt-8 px-4">
	<h2 class="text-xl flex flex-wrap items-center gap-x-2 w-full mb-4">
		<span> <ClockIcon /> </span> Availability
	</h2>
	<div class="flex flex-col gap-y-2 pl-4 w-full">
		{#each keys as day, index}
			<div class="p-2 flex flex-col gap-y-1">
				<div class="flex justify-between gap-x-1">
					<div class="flex items-center gap-x-2">
						<Dash space={0} />
						<span class="flex text-sm font-semibold items-center">{day}</span>
					</div>
					<div class="flex items-center gap-x-px">
						<Popover.Root>
							<Popover.Trigger asChild let:builder>
								<Button builders={[builder]} size="sm-icon" variant="ghost">
									<PlusCircleIcon size={20} />
								</Button>
							</Popover.Trigger>
							<Popover.Content class="p-0 w-max flex flex-col h-[267px] rounded-lg gap-y-2">
								<TimePickerV2Range
									osteopathId={data.osteopath?.id}
									{day}
									on:load={({ detail }) => {
										if (availability) {
											console.log(detail, availability);
											availability = [...availability, detail];
											result = getGroupedByDate();
										}
									}}
									method="add"
									selected={new Temporal.PlainTime(9, 0, 0)}
									selected2={new Temporal.PlainTime(17, 0, 0)}
								/>
							</Popover.Content>
						</Popover.Root>
						<Button size="sm-icon" variant="ghost">
							<SettingsIcon size={20} />
						</Button>
					</div>
				</div>
				<ul class="flex flex-col gap-y-1 pl-6">
					{#each result[day] as { startTime, endTime, id }, i}
						<li class="flex gap-x-1 items-center justify-between w-full">
							<div class="flex gap-x-1">
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
									<!-- <Button class="tabular-nums inline-flex gap-x-1 px-2 py-1 border">
									{startTime}
									<ChevronDownIcon />
								</Button> -->
								</div>
								<Popover.Root>
									<Popover.Trigger asChild let:builder>
										<Button
											builders={[builder]}
											size="sm-icon"
											class="text-blue-500 hover:bg-blue-50 hover:text-blue-500"
											variant="ghost"
										>
											<Edit3 size={20} />
										</Button>
									</Popover.Trigger>
									<Popover.Content class="p-0 w-max flex flex-col h-[267px] rounded-lg gap-y-2">
										<TimePickerV2Range
											time_availability_id={id}
											selected={fromTimeStr(startTime)}
											selected2={fromTimeStr(endTime)}
											on:load={({ detail: { startTime, endTime } }) => {
												console.log('Data', startTime, endTime);
												if (availability) {
													const i = availability.findIndex((o) => o.id === id);
													availability[i].startTime = startTime;
													availability[i].endTime = endTime;
													availability = availability;
													result = getGroupedByDate();
												}
											}}
										/>
									</Popover.Content>
								</Popover.Root>
							</div>
							<div class="flex items-center gap-x-px">
								<Button
									size="sm-icon"
									variant="ghost"
									class="text-rose-500 hover:bg-rose-50 hover:text-rose-500"
									on:click={async (event) => {
										if (availability) {
											try {
												const index = availability?.findIndex((a) => a.id === id);
												const res = await handleDelete({ id });
												if (index !== -1) {
													availability.splice(index, 1);
												}
												availability = availability;
												result = getGroupedByDate();
											} catch (error) {
												console.log(
													'Unable to trash the',
													day,
													id,
													startTime,
													endTime,
													'\n',
													error
												);
											}
										}
									}}
								>
									<DeleteIcon size={20} />
								</Button>
							</div>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
</div>

<!-- <DropdownMenu.Root
									positioning={{
										placement: 'bottom-end'
									}}
								>
									<DropdownMenu.Trigger asChild let:builder>
										<Button builders={[builder]} size="sm-icon" variant="ghost">
											<MoreVerticalIcon size={20} />
										</Button>
									</DropdownMenu.Trigger>
									<DropdownMenu.Content class="min-w-[none] flex flex-col gap-y-1">
										<DropdownMenu.Item asChild>
											<Button size="sm" class="w-20">Edit Item</Button>
										</DropdownMenu.Item>
										<DropdownMenu.Item asChild>
											<Button size="sm" variant="destructive" class="w-20">Delete Item</Button>
										</DropdownMenu.Item>
									</DropdownMenu.Content>
								</DropdownMenu.Root> -->
