<script lang="ts">
	import '../app.postcss';
	import { HomeIcon, LogOutIcon, MenuIcon, PlusIcon } from 'lucide-svelte';
	import Logo from '$lib/components/ui/logo.svelte';
	import Google from '$lib/components/ui/icons/google.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { enhance } from '$app/forms';
	import { CheckIcon, Loader2Icon } from 'lucide-svelte';
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	export let data: LayoutData;
	import { RadioGroup, RadioGroupItem } from '$lib/components/ui/radio-group';
	import { Temporal } from '@js-temporal/polyfill';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	// import { ProgressBar } from '@prgm/sveltekit-progress-bar';
	import { isOsteopath } from '$lib/helpers/utils';

	let loading = false;
	const today = Temporal.Now.plainDateISO();
	let dialogEl: HTMLDialogElement;
	let value: any;
	let loadingTimeslotAction = false;
</script>

<svelte:head>
	<title>Home Page</title>
</svelte:head>

<!-- <ProgressBar class="text-green-500" /> -->

<header class="w-full max-w-sm bg-white px-3 py-4 flex justify-between items-center">
	<div id="logo" class="flex items-center gap-x-2 text-slate-700">
		{#if $page.url.pathname === '/'}
			{#if data.user?.image}
				<a href={`/students/student/${data.user.id}`}>
					<img
						width={48}
						height={48}
						src={data.user.image}
						aria-hidden="true"
						alt="Avatar Picture"
					/>
				</a>
			{:else}
				<Logo size={48} />
			{/if}
		{:else}
			<Button on:click={() => goto('/')} disabled={loading} type="submit" class="text-base">
				<HomeIcon />
				Home
			</Button>
		{/if}
	</div>
	<nav>
		{#if data.logged}
			<DropdownMenu.Root
				positioning={{
					placement: 'top-end'
				}}
			>
				<DropdownMenu.Trigger asChild let:builder>
					<Button builders={[builder]} class="px-1.5">
						<MenuIcon />
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="w-max">
					<DropdownMenu.Item asChild>
						<form
							method="POST"
							action="/?/logout"
							use:enhance={() => {
								loading = true;
								return async ({ update }) => {
									await update();
									data.logged = false;
									loading = false;
								};
							}}
						>
							<button
								disabled={loading}
								type="submit"
								class="text-base w-full hover:bg-rose-200 inline-flex gap-x-2 p-1"
							>
								{#if loading}
									<Loader2Icon />
								{:else}
									<LogOutIcon />
								{/if}
								Logout
							</button>
						</form>
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		{:else}
			<form
				method="POST"
				action="/?/login"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						await update();
						data.logged = false;
						loading = false;
					};
				}}
			>
				<Button disabled={loading} type="submit" class="text-base">
					{#if loading}
						<Loader2Icon />
					{:else}
						<Google />
					{/if}
					Continue With Google
				</Button>
			</form>
		{/if}
	</nav>
</header>

<!-- <pre class="max-w-md overflow-auto">{JSON.stringify(data, null, 2)}</pre> -->

<main class="max-w-sm flex flex-col w-full px-1 sm:p-0 items-center">
	<slot />
</main>

{#if isOsteopath(data.user?.email)}
	<dialog bind:this={dialogEl} class="p-4 w-full max-w-xs">
		<form
			method="post"
			action="/?/dialog"
			use:enhance={({ formData }) => {
				console.log(formData);
				loadingTimeslotAction = true;
				return async ({ update }) => {
					await update({ reset: false });
					loadingTimeslotAction = false;
					dialogEl.close();
				};
			}}
		>
			<div class="flex flex-col mb-4">
				<label for="on"> Date </label>
				<div class="mt-2">
					<input
						class="w-full"
						type="date"
						name="on"
						min={today.toString()}
						max={today.add({ days: 21 }).toString()}
						id="on"
						value={today.toString()}
					/>
				</div>
			</div>
			<div class="flex flex-col mb-4">
				<label for="start-at"> Start At </label>
				<div class="mt-2">
					<input
						class="w-full invalid:text-rose-500"
						type="time"
						name="start-at"
						id="start-at"
						value="13:00"
						min={'06:00'}
						max={'20:00'}
					/>
				</div>
			</div>
			<div class="flex flex-col mb-6">
				<h4 class="">Duration</h4>
				<RadioGroup
					defaultValue="30"
					class="inline-flex gap-x-2 w-full mt-2"
					on:valueChange={({ detail: newValue }) => (value = newValue)}
				>
					<div class="flex items-center space-x-2">
						<RadioGroupItem name="duration" value="30" id="r1" />
						<label aria-hidden="true" class="hidden" for="r1">30 minutes</label>
					</div>
					<div class="flex items-center space-x-2">
						<RadioGroupItem name="duration" value="45" id="r2" />
						<label aria-hidden="true" class="hidden" for="r2">45 minutes</label>
					</div>
					<div class="flex items-center space-x-2">
						<RadioGroupItem name="duration" value="60" id="r3" />
						<label aria-hidden="true" class="hidden" for="r3">60 minutes</label>
					</div>
				</RadioGroup>
			</div>
			<div class="inline-flex gap-x-4">
				<button
					disabled={loadingTimeslotAction}
					class="form-input border-transparent bg-slate-100"
					value="cancel"
					formmethod="dialog"
				>
					Cancel
				</button>
				<button
					type="submit"
					{value}
					disabled={loadingTimeslotAction}
					class="inline-flex form-input items-center bg-indigo-600 text-white gap-x-2"
				>
					{#if loadingTimeslotAction}
						<Loader2Icon class="animate-spin" />
					{:else}
						<CheckIcon />
					{/if}
					Submit
				</button>
			</div>
		</form>
	</dialog>
	<button
		class="flex items-center pl-2 pr-3.5 py-1 border border-slate-400 hover:bg-slate-100 cursor-pointer active:bg-slate-200/80 transition-colors fixed bottom-10 right-6 text-xl gap-x-2 z-10 bg-slate-50/20 backdrop-blur-sm"
		on:click={() => dialogEl.showModal()}
	>
		<PlusIcon class="w-8 h-8 p-0.5" /> Create Timeslot
	</button>
{/if}
