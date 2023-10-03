<script lang="ts">
	// import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import * as Popover from '$lib/components/ui/popover';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Temporal } from '@js-temporal/polyfill';
	import type { PageData } from './$types';
	export let data: PageData;
	import groupBy from 'just-group-by';
	import {
		ClockIcon,
		DeleteIcon,
		Edit3,
		MoreVerticalIcon,
		PlusCircleIcon,
		SettingsIcon
	} from 'lucide-svelte';
	import Dash from '$lib/components/Dash.svelte';
	import TimePickerV2Range from '$lib/modules/time-picker-v2-range.svelte';
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
			endTime: getTimeStr(17, 0)
		},
		{
			id: 4,
			day: 'Tuesday',
			startTime: getTimeStr(9, 0),
			endTime: getTimeStr(17, 0)
		},
		{
			id: 5,
			day: 'Wednesday',
			startTime: getTimeStr(9, 0),
			endTime: getTimeStr(17, 0)
		},
		{
			id: 6,
			day: 'Thrusday',
			startTime: getTimeStr(9, 0),
			endTime: getTimeStr(17, 0)
		},
		{
			id: 7,
			day: 'Friday',
			startTime: getTimeStr(9, 0),
			endTime: getTimeStr(17, 0)
		},
		{
			id: 7,
			day: 'Saturday',
			startTime: getTimeStr(9, 0),
			endTime: getTimeStr(17, 0)
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
							<Popover.Root>
								<Popover.Trigger asChild let:builder>
									<Button builders={[builder]} size="sm-icon" variant="ghost">
										<PlusCircleIcon size={20} />
									</Button>
								</Popover.Trigger>
								<Popover.Content class="p-0 w-max flex flex-col h-[267px] rounded-lg gap-y-2">
									<TimePickerV2Range
										selected={new Temporal.PlainTime(9, 0, 0)}
										selected2={new Temporal.PlainTime(17, 0, 0)}
									/>
									<div class="flex gap-x-2">
										<Button class="w-full" variant="outline">Cancel</Button>
										<Button class="w-full">Add</Button>
									</div>
								</Popover.Content>
							</Popover.Root>

							<Button size="sm-icon" variant="ghost">
								<SettingsIcon size={20} />
							</Button>
						</div>
					</div>
					<ul class="flex flex-col gap-y-1 pl-6">
						{#each result[day] as { startTime, endTime }, i}
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
												selected={fromTimeStr(startTime)}
												selected2={fromTimeStr(endTime)}
											/>
											<div class="flex gap-x-2">
												<Button class="w-full" variant="outline">Cancel</Button>
												<Button class="w-full">Update</Button>
											</div>
										</Popover.Content>
									</Popover.Root>
								</div>
								<div class="flex items-center gap-x-px">
									<AlertDialog.Root>
										<AlertDialog.Trigger asChild let:builder>
											<Button
												builders={[builder]}
												size="sm-icon"
												variant="ghost"
												class="text-rose-500 hover:bg-rose-50 hover:text-rose-500"
											>
												<DeleteIcon size={20} />
											</Button>
										</AlertDialog.Trigger>
										<AlertDialog.Content>
											<AlertDialog.Header>
												<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
												<AlertDialog.Description>
													This action cannot be undone. This will permanently delete your account
													and remove your data from our servers.
												</AlertDialog.Description>
											</AlertDialog.Header>
											<AlertDialog.Footer>
												<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
												<AlertDialog.Action>Continue</AlertDialog.Action>
											</AlertDialog.Footer>
										</AlertDialog.Content>
									</AlertDialog.Root>
								</div>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
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
