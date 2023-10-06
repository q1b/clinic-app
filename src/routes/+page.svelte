<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import groupBy from 'just-group-by';
	import type { PageData } from './$types';
	import { Temporal } from '@js-temporal/polyfill';
	import Dash from '$lib/components/Dash.svelte';
	import { ArrowRightIcon } from 'lucide-svelte';
	export let data: PageData;

	$: appointments = data.appointments.filter(
		(appointment) => appointment.osteopath.user.id !== data.user?.id
	);
	$: bydates = groupBy(appointments ?? [], (appointment) => appointment.date);
</script>

<div class="w-full flex flex-row gap-x-4 overflow-x-scroll mb-10 mt-3">
	{#each data.osteopaths as osteopath}
		<a
			href={`/osteopath${data.user?.id === osteopath.userId ? '/verified/' : '/'}${osteopath.id}`}
			class="flex cursor-pointer flex-col shrink-0 w-40 gap-y-1 p-2 bg-card border-border border-2 rounded-md"
		>
			<div class="w-full flex items-center justify-center mb-1">
				<img
					class="w-full aspect-square rounded-md"
					src={osteopath.user.image}
					alt={`${osteopath.user.name} Profile Image`}
				/>
			</div>
			<h4 class="text-base w-max font-bold">{osteopath.user.name}</h4>
			<p class="line-clamp-3 text-sm">{osteopath.user.bio}</p>
		</a>
	{/each}
</div>
<div class="w-full px-2">
	<h2 class="text-xl mb-8">Appointments</h2>
	<ul class="flex flex-col gap-y-6">
		{#each Object.keys(bydates) as date}
			<li class="px-2 flex flex-col gap-y-2">
				<h2 class="text-lg font-bold flex items-center gap-x-1">
					<Dash />
					<span> {date} </span>
				</h2>
				<ul class="pl-1 gap-y-2 flex flex-col">
					{#each bydates[date] as { duration, startAt, osteopath }}
						{@const [hour, minute] = startAt?.split(':').map((v) => +v)}
						{@const name = osteopath.user.name}
						<li class="flex items-center gap-x-2 w-full justify-between">
							<div class="flex items-center w-full">
								<div class="flex gap-x-1 w-full">
									<div class="flex items-center shrink-0">
										<span
											>{new Temporal.PlainTime(hour, minute).toLocaleString('en-us', {
												hour: '2-digit',
												minute: '2-digit'
											})}
										</span>
										<Dash space={4} />
										<span class="whitespace-nowrap">
											{duration} min
										</span>
									</div>
									<div class="flex grow gap-x-1 overflow-x-auto">
										<span class="text-muted-foreground whitespace-nowrap w-1">
											{name}
										</span>
									</div>
								</div>
							</div>
							<Button size="sm" variant="outline" class="h-6 px-2 gap-x-1">
								Book <ArrowRightIcon class="w-3.5 h-3.5" />
							</Button>
						</li>
					{/each}
				</ul>
			</li>
		{/each}
	</ul>
</div>
