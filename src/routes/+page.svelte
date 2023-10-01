<script lang="ts">
	import groupBy from 'just-group-by';
	import type { PageData } from './$types';
	import { Temporal } from '@js-temporal/polyfill';
	import Dash from '$lib/components/Dash.svelte';
	export let data: PageData;

	$: appointments = data.appointments.filter(
		(appointment) => appointment.osteopath.user.id !== data.user?.id
	);
	$: bydates = groupBy(appointments ?? [], (appointment) => appointment.date);

	const getFormattedTime = (hour: number, minute: number) => {
		try {
			return new Temporal.PlainTime(hour, minute).toLocaleString('en-us', {
				hour: '2-digit',
				minute: '2-digit'
			});
		} catch (error) {
			return undefined;
		}
	};
</script>

<div class="w-full flex flex-row gap-x-4 overflow-x-scroll mb-10 mt-3">
	{#each data.osteopaths as osteopath}
		<a
			href={`/osteopath/${osteopath.id}`}
			class="flex cursor-pointer flex-col items-start shrink-0 w-36 gap-y-1 sm:gap-y-2 p-2"
		>
			<img
				class="w-32 h-32"
				src={osteopath.user.image}
				alt={`${osteopath.user.name} Profile Image`}
			/>
			<h4 class="text-base sm:text-lg md:text-xl w-max font-bold">{osteopath.user.name}</h4>
			<p class="line-clamp-3 text-sm sm:text-base">{osteopath.user.bio}</p>
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
				<ul class="pl-1 gap-y-3">
					{#each bydates[date] as { duration, startAt, osteopath }}
						{@const [hour, minute] = startAt?.split(':').map((v) => +v)}
						{@const name = osteopath.user.name}
						<li class="flex items-center gap-x-2 w-full justify-between">
							<div>
								<span>{getFormattedTime(hour, minute)}</span>
								<span>
									{name}
								</span>
							</div>
							<button class="bg-slate-100 px-2 py-0.5"> Book </button>
						</li>
					{/each}
				</ul>
			</li>
		{/each}
	</ul>
</div>
<div class=""></div>
