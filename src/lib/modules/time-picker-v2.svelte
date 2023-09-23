<script lang="ts">
	import { Temporal } from '@js-temporal/polyfill';

	let morning = true;

	let times = [] as Temporal.PlainTime[];
	let startTime = new Temporal.PlainTime(7, 0, 0);
	let endTime = new Temporal.PlainTime(18, 0, 0);
	let now = new Temporal.PlainTime(startTime.hour, startTime.minute);

	let selected: Temporal.PlainTime;

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

<div class="w-max flex flex-col h-[267px]">
	<div class="flex gap-x-1 mt-1 mb-1 pt-2">
		<span class="tabular-nums px-1"
			>Start At {selected
				? selected.toLocaleString('en-us', {
						hour: '2-digit',
						minute: '2-digit',
						hour12: false
				  })
				: '00:00'}
		</span>
		<div class="flex gap-x-1 bg-white text-slate-800 pl-1 pr-0 border-r-0 border rounded-md">
			<label for="duration">Duration</label>
			<select
				id="duration"
				name="duration"
				autocomplete="duration-value"
				class="block bg-none py-0 w-full px-1.5 rounded-md border-0 bg-blue-500 text-white shadow-sm ring-1 ring-inset ring-transparent focus:ring-2 focus:ring-inset focus:ring-indigo-600"
			>
				<option>30</option>
				<option>45</option>
				<option>60</option>
			</select>
		</div>
	</div>
	<div
		class="grid grid-cols-4 gap-1 pt-28 overflow-y-scroll pb-1 px-1 h-0 grow place-content-center border rounded-lg"
	>
		{#each times as time}
			<button
				type="button"
				class={`tabular-nums text-sm px-1 py-0.5 border rounded-md ${
					selected && time.equals(selected) && 'bg-blue-500 text-white'
				}`}
				on:click={() => (selected = time)}
			>
				{time.toLocaleString('en-us', {
					hour: '2-digit',
					minute: '2-digit',
					hour12: false
				})}
			</button>
		{/each}
	</div>
</div>
