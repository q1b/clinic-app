<script>
	import ThemeButton from '$lib/components/theme-button.svelte';
	import { CalendarIcon } from 'lucide-svelte';
	import '../app.css';
	import { Temporal } from '@js-temporal/polyfill';
	const now = Temporal.Now.plainDateISO();
</script>

<header class="flex w-full max-w-5xl items-center gap-x-2 justify-between mb-10 p-3">
	<div class="flex items-center gap-x-2">
		<a href="/" class="inline-flex gap-x-2 items-center p-2 bg-layer-3 rounded-lg tabular-nums">
			<span>{now.toLocaleString()}</span>
			<CalendarIcon />
		</a>
	</div>
	<nav class="">
		<!-- TODO: Adding feature to search bar for Osteopath -->
		<ThemeButton size={36} />
	</nav>
</header>

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
