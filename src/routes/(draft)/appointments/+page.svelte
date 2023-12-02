<script lang="ts">
	import type { PageData } from './$types';
	import * as Tabs from '$lib/components/ui/tabs';
	const appointments = [
		{ name: 'upcoming', description: 'Complete List of Appointments', href: '#', current: true },
		{ name: 'completed', href: '#', current: false },
		{ name: 'all', href: '#', current: false }
	];
	export let data: PageData;
</script>

<div class="w-full max-w-5xl flex flex-col items-start">
	<h3 class="text-3xl mb-4 font-medium text-indigo-500">Your Upcoming Sessions</h3>
	<pre> {JSON.stringify(data.appointmentsByDate, null, 2)} </pre>
	{#each Object.keys(data.appointmentsByDate || {}) as date}
		<div class="p-2 bg-layer-2 shadow shadow-layer-0">
			{date}
			<div>
				{#each data.appointmentsByDate[date] as appointment}
					<div>{appointment.startTime}</div>
					<div>{appointment.user}</div>
				{/each}
			</div>
		</div>
	{/each}
	<Tabs.Root value="booked" class="w-full flex flex-col items-start">
		<Tabs.List>
			<Tabs.Trigger value="all">All</Tabs.Trigger>
			<Tabs.Trigger value="booked">Booked</Tabs.Trigger>
			<Tabs.Trigger value="pending">Pending</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="all">All</Tabs.Content>
		<Tabs.Content value="booked">Upcoming</Tabs.Content>
		<Tabs.Content value="pending">Complete</Tabs.Content>
	</Tabs.Root>
</div>
