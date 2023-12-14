<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { UserPlusIcon } from 'lucide-svelte';
	import type { PageData } from '../$types';
	import DataTable from './data-table.svelte';
	import { enhance } from '$app/forms';
	export let data: PageData;
	let dialogEl: HTMLDialogElement;
	let loading = false;
</script>

<!-- Implementing User:Delete -->
<div class="max-w-5xl w-full px-4">
	<div class="sm:flex sm:items-center mb-10">
		<div class="sm:flex-auto">
			<h1 class="text-base font-semibold leading-6 text-layer-12">Appointments</h1>
			<p class="mt-2 text-sm text-layer-11">
				A list of all the appointments between osteopath and user
			</p>
		</div>
		<div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
			<Button
				on:click={() => dialogEl.showModal()}
				icon={UserPlusIcon}
				class="bg-indigo-500 hover:bg-indigo-600 scale-105 active:scale-100 transition-all dark:text-white"
			>
				<span class="h-[18px]">Add Appointment</span>
			</Button>
		</div>
	</div>
	{#await data.users.data}
		Loading ...
	{:then users}
		<DataTable data={users} />
	{/await}
</div>

<dialog
	bind:this={dialogEl}
	class="p-4 w-full max-w-xs rounded-md bg-layer-3 backdrop:backdrop-blur-sm border border-layer-7"
>
	<form
		method="post"
		action="?/create"
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				await update();
				loading = false;
				dialogEl.close();
			};
		}}
	>
		<div class="mb-4">
			<label for="on" class="block text-sm font-medium leading-6 text-layer-10 sr-only">
				Date
			</label>
			<div class="mt-1">
				<input
					type="date"
					name="on"
					id="on"
					required
					class="appearance-none block w-full bg-layer-2 text-layer-12 caret-layer-12 rounded-md py-2 border-0 shadow-sm shadow-layer-1 ring-1 ring-inset ring-layer-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-layer-9"
				/>
			</div>
		</div>
		<div class="mb-4">
			<label for="start-at" class="block text-sm font-medium leading-6 text-layer-10 sr-only">
				Start At
			</label>
			<div class="mt-1">
				<input
					required
					class="appearance-none block w-full bg-layer-2 text-layer-12 caret-layer-12 rounded-md py-2 border-0 shadow-sm shadow-layer-1 ring-1 ring-inset ring-layer-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-layer-9"
					type="time"
					name="start-at"
					id="start-at"
					value="13:00"
					min={'06:00'}
					max={'20:00'}
				/>
			</div>
		</div>
		<div>
			<label for="duration" class="block text-sm font-medium leading-6 text-layer-11"
				>Duration</label
			>
			<select
				id="duration"
				name="duration"
				class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-layer-12 ring-1 ring-inset ring-layer-6 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
			>
				<option selected value="30">30 min</option>
				<option value="45">45 min</option>
				<option value="60">60 min</option>
			</select>
		</div>
		<div class="inline-flex gap-x-4 mt-4">
			<Button
				value="cancel"
				on:click={() => dialogEl.close()}
				variant="secondary"
				formmethod="dialog">Cancel</Button
			>
			<Button type="submit" disabled={loading} variant="default" class="gap-x-1">Submit</Button>
		</div>
	</form>
</dialog>
