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
	import { ChoiceGroup, ChoiceGroupItem } from '$lib/components/ui/choice-group';
	import { Temporal } from '@js-temporal/polyfill';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	import { ProgressBar } from '@prgm/sveltekit-progress-bar';
	import { isOsteopath } from '$lib/helpers/utils';
	import { Toaster } from 'svelte-sonner';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	let loading = false;
	const today = Temporal.Now.plainDateISO();
	let dialogEl: HTMLDialogElement;
	let value: any;
	let loadingTimeslotAction = false;
</script>

<svelte:head>
	<title>Home Page</title>
</svelte:head>

<Toaster />
<ProgressBar class="text-green-500" />

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
			<Button
				on:click={() => goto('/')}
				variant="outline"
				disabled={loading}
				type="submit"
				class="text-base justify-start gap-x-2"
			>
				<HomeIcon class="w-5 h-5" />
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
					<Button builders={[builder]} size="icon" variant="outline">
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
							class="w-full"
						>
							<Button
								disabled={loading}
								class="w-full items-center justify-start gap-x-2"
								variant="destructive-subtle"
								type="submit"
							>
								{#if loading}
									<Loader2Icon />
								{:else}
									<LogOutIcon />
								{/if}
								Logout
							</Button>
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
				<Button disabled={loading} type="submit" class="gap-x-2 px-3" variant="outline">
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
	<dialog bind:this={dialogEl} class="p-4 w-full max-w-xs rounded-md shadow-md">
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
				<Label for="on">Date</Label>
				<div class="mt-2">
					<Input
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
				<Label for="start-at">Start At</Label>
				<div class="mt-2">
					<Input
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
				<h4 class="text-sm font-semibold">Duration</h4>
				<ChoiceGroup
					defaultValue="30"
					class="inline-flex gap-x-2 w-full mt-2"
					on:valueChange={({ detail: newValue }) => (value = newValue)}
				>
					<div class="flex items-center space-x-2">
						<ChoiceGroupItem name="duration" value="30" id="r1" />
						<label aria-hidden="true" class="hidden" for="r1">30 minutes</label>
					</div>
					<div class="flex items-center space-x-2">
						<ChoiceGroupItem name="duration" value="45" id="r2" />
						<label aria-hidden="true" class="hidden" for="r2">45 minutes</label>
					</div>
					<div class="flex items-center space-x-2">
						<ChoiceGroupItem name="duration" value="60" id="r3" />
						<label aria-hidden="true" class="hidden" for="r3">60 minutes</label>
					</div>
				</ChoiceGroup>
			</div>
			<div class="inline-flex gap-x-4">
				<Button
					disabled={loadingTimeslotAction}
					value="cancel"
					variant="secondary"
					formmethod="dialog"
				>
					Cancel
				</Button>
				<Button
					type="submit"
					{value}
					disabled={loadingTimeslotAction}
					variant="default"
					class="gap-x-2"
				>
					{#if loadingTimeslotAction}
						<Loader2Icon class="animate-spin" />
					{:else}
						<CheckIcon />
					{/if}
					Submit
				</Button>
			</div>
		</form>
	</dialog>
	<Button
		class="fixed bottom-10 right-6 gap-x-2 pl-2"
		variant="outline"
		on:click={() => dialogEl.showModal()}
	>
		<PlusIcon class="w-8 h-8 p-0.5" /> <span class="text-lg">Create Timeslot</span>
	</Button>
{/if}
