<script lang="ts">
	import type { Temporal } from '@js-temporal/polyfill';
	import DatePicker from '../modules/date-picker.svelte';
	import TimePicker from '../modules/time-picker.svelte';
	import type { PageData } from './$types';
	console.log('SERVER RENDERED');
	let date: Temporal.PlainDate;
	let startAt: Temporal.PlainTime;
	let duration: number;

	export let data: PageData;
	$: logged = !!data?.sessionId ? true : false;
</script>

<pre>{JSON.stringify(data, null, 2)}</pre>

{#if logged}
	<form method="POST" action="?/logout">
		<button>Logout</button>
	</form>
{/if}

{#if !logged}
	<form method="POST" action="?/login">
		<button>Login</button>
	</form>
{/if}

<div class="p-6 w-max flex gap-4">
	<DatePicker bind:selected={date} />
	<div class="flex flex-col">
		<TimePicker bind:selected={startAt} bind:duration />
		<div class="flex justify-between">
			<div />
			<button
				on:click={() => {
					console.log(startAt);
					console.log(date);
					console.log(duration);
				}}
				class="mt-2 bg-slate-600 text-white flex items-center gap-x-1 px-2 py-1 shadow rounded-md"
			>
				<span>Create Appointment</span>
				<span
					><svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
					</svg>
				</span>
			</button>
		</div>
	</div>
</div>
