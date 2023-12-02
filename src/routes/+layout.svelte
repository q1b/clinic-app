<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import type { LayoutServerData } from './$types';
	import ThemeButton from '$lib/components/theme-button.svelte';
	import {
		CalendarIcon,
		HomeIcon,
		LogInIcon,
		LogOutIcon,
		MenuIcon,
		Settings2Icon,
		User2Icon
	} from 'lucide-svelte';
	import '../app.css';
	import { Temporal } from '@js-temporal/polyfill';
	import Button from '$lib/components/ui/button/button.svelte';
	import Spinner from '$lib/components/spinner.svelte';
	import { enhance } from '$app/forms';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Logo from '$lib/components/logo.svelte';
	// import { setContext } from 'svelte';
	// import { writable } from 'svelte/store';
	// import { createLocalStorage, persist } from '@macfja/svelte-persistent-store';
	const now = Temporal.Now.plainDateISO();
	export let data: LayoutServerData;
	let exiting: boolean = false;
	// $: console.log(data);
	// // Create a store and update it when necessary...
	// let user = persist<typeof data.user>(writable(), createLocalStorage(), 'user');
	// $: user.set(data.user);
	// // ...and add it to the context for child components to access
	// setContext('user', user);
</script>

<header class="flex w-full max-w-5xl items-center gap-x-2 justify-between mb-10 p-3">
	<div class="flex items-center gap-x-2">
		{#if data.isLogged}
			<div class="flex gap-x-1 bg-layer-0 items-center border pl-1 py-1 pr-4 rounded-full relative">
				<Avatar.Root class="w-8 h-8 m-1">
					<Avatar.Image src={data.user.image} alt="avatar" />
					<Avatar.Fallback>CN</Avatar.Fallback>
				</Avatar.Root>
				<div
					class="flex overflow-auto max-w-[224px] -space-y-1 flex-col p-0.5 items-start font-medium"
				>
					<span class="">{data.user.name}</span>
					<span class="text-sm">{data.user.email || '-----@-.com'}</span>
				</div>
			</div>
		{:else}
			<a href="/" class="inline-flex gap-x-2 items-center p-2 bg-layer-3 rounded-lg tabular-nums">
				<span>{now.toLocaleString()}</span>
				<CalendarIcon />
			</a>
		{/if}
	</div>
	<nav class="inline-flex items-center gap-x-4">
		<!-- TODO: Adding feature to search bar for Osteopath -->
		<ThemeButton size={36} />
		<DropdownMenu.Root
			positioning={{
				placement: 'top-end'
			}}
		>
			<DropdownMenu.Trigger asChild let:builder>
				<Button icon={MenuIcon} builders={[builder]} size="icon" variant="outline" />
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-max bg-layer-2 flex flex-col gap-y-2">
				{#if !data.isLogged}
					<DropdownMenu.Item asChild>
						<Button
							href="/login"
							class="w-full bg-layer-3 hover:bg-layer-4 items-center justify-start gap-x-2 p-2"
							variant="ghost"
							size="sm"
						>
							<LogInIcon size={16} />
							LogIn
						</Button>
					</DropdownMenu.Item>
				{:else}
					<DropdownMenu.Item asChild>
						<Button
							href="/"
							class="w-full bg-layer-3 hover:bg-layer-4 items-center justify-start gap-x-2 p-2"
							variant="ghost"
							size="sm"
						>
							<HomeIcon size={16} />
							Home
						</Button>
					</DropdownMenu.Item>
					<DropdownMenu.Item asChild>
						<Button
							href="/settings"
							class="w-full bg-layer-3 hover:bg-layer-4 items-center justify-start gap-x-2 p-2"
							variant="ghost"
							size="sm"
						>
							<Settings2Icon size={16} />
							Settings
						</Button>
					</DropdownMenu.Item>
					<DropdownMenu.Item asChild>
						<form
							method="POST"
							action="/?/logout"
							use:enhance={() => {
								exiting = true;
								return async ({ update }) => {
									await update();
									// $user = {
									// 	email: null,
									// 	image: null,
									// 	isOsteopath: false,
									// 	name: null
									// };
									exiting = false;
								};
							}}
							class="w-full"
						>
							<Button
								disabled={exiting}
								class="w-full bg-rose-500/5 hover:bg-rose-100 dark:hover:bg-rose-500/10 items-center justify-start gap-x-2 p-2"
								variant="destructive-subtle"
								size="sm"
								type="submit"
							>
								{#if exiting}
									<Spinner size={16} />
								{:else}
									<LogOutIcon size={16} />
								{/if}
								Log out
							</Button>
						</form>
					</DropdownMenu.Item>
				{/if}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</nav>
</header>

<slot />
<div class="pt-10"></div>
<footer
	class="w-full max-w-5xl mt-auto bg-layer-2 py-2 pl-2 pr-4 mb-10 flex flex-col shadow-md shadow-layer-6/30 rounded-xl"
>
	<div class="flex flex-col sm:flex-row items-center gap-y-4 mb-2 sm:mb-1 justify-between w-full">
		<div class="flex items-center gap-x-2">
			<Logo size={36} />
			<div class="whitespace-nowrap text-2xl font-semibold text-layer-12">V2O</div>
		</div>
		<div
			class="flex flex-wrap xs:flex-row items-center justify-center space-x-4 text-sm font-semibold leading-6 text-layer-11"
		>
			<a href="/privacy-policy" class="hover:underline">Privacy policy</a>
			<div class="h-4 w-px hidden xs:block bg-slate-500/20"></div>
			<a href="/term-of-service" class="hover:underline">Term of Service</a>
			<div class="h-4 w-px hidden xs:block bg-slate-500/20"></div>
			<a href="/contact-us" class="hover:underline">Contact Us</a>
		</div>
	</div>
	<span class="p-px mt-1 font-medium text-sm text-layer-9 text-center sm:text-left"
		>built with sveltekit, typescript,<br class="block xs:hidden" /> tailwindcss and tursodb</span
	>
</footer>

<div
	class="fixed bottom-1 left-1 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-gray-950 p-3 font-robotic text-xs text-white"
>
	<div class="block xs:hidden">vs</div>
	<div class="hidden xs:block sm:hidden">xs</div>
	<div class="hidden sm:block md:hidden">sm</div>
	<div class="hidden md:block lg:hidden">md</div>
	<div class="hidden lg:block xl:hidden">lg</div>
	<div class="hidden xl:block 2xl:hidden">xl</div>
	<div class="hidden 2xl:block">2xl</div>
</div>

<style lang="postcss"></style>
