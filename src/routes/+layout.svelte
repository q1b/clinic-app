<script lang="ts">
	import type { LayoutServerData } from './$types';
	import ThemeButton from '$lib/components/theme-button.svelte';
	import { CalendarIcon, LogOutIcon } from 'lucide-svelte';
	import '../app.css';
	import { Temporal } from '@js-temporal/polyfill';
	import Button from '$lib/components/ui/button/button.svelte';
	import Spinner from '$lib/components/spinner.svelte';
	import { enhance } from '$app/forms';
	const now = Temporal.Now.plainDateISO();
	export let data: LayoutServerData;
	let exiting: boolean = false;
</script>

<header class="flex w-full max-w-5xl items-center gap-x-2 justify-between mb-10 p-3">
	<div class="flex items-center gap-x-2">
		<a href="/" class="inline-flex gap-x-2 items-center p-2 bg-layer-3 rounded-lg tabular-nums">
			<span>{now.toLocaleString()}</span>
			<CalendarIcon />
		</a>
	</div>
	<nav class="inline-flex items-center gap-x-4">
		<!-- TODO: Adding feature to search bar for Osteopath -->
		<ThemeButton size={36} />
		{#if data.user}
			<form
				method="POST"
				action="/?/logout"
				use:enhance={() => {
					exiting = true;
					return async ({ update }) => {
						await update();
						data.user = null;
						exiting = false;
					};
				}}
				class="w-full"
			>
				<Button
					disabled={exiting}
					class="w-full items-center justify-start gap-x-2 p-2"
					variant="destructive-subtle"
					size="icon"
					type="submit"
				>
					{#if exiting}
						<Spinner size={16} />
					{:else}
						<LogOutIcon />
					{/if}
				</Button>
			</form>
		{/if}
	</nav>
</header>
<pre class="mb-12">{data.user?.name}</pre>
<slot />

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
