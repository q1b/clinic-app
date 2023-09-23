<script lang="ts">
	import '../app.postcss';
	import { CheckIcon, LogOutIcon, XIcon } from 'lucide-svelte';
	import Logo from '$lib/components/ui/logo.svelte';
	import Google from '$lib/components/ui/icons/google.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { enhance } from '$app/forms';
	import { Loader2Icon } from 'lucide-svelte';
	import type { LayoutData } from './$types';
	let loading = false;
	export let data: LayoutData;
</script>

<svelte:head>
	<title>Osteopath Student</title>
</svelte:head>

<header class="w-full max-w-5xl bg-white px-3 py-2 flex justify-between items-center">
	<div id="logo" class="flex items-center gap-x-2 text-slate-700">
		<Logo size={32} />
	</div>
	<nav>
		<form
			method="POST"
			action={data.logged ? '?/logout' : '?/login'}
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					await update();
					data.logged = !data.logged;
					loading = false;
				};
			}}
		>
			<Button disabled={loading} type="submit" class="text-base">
				{#if loading}
					<Loader2Icon />
				{:else if data.logged}
					<LogOutIcon />
				{:else}
					<Google />
				{/if}
				{data.logged ? 'Logout' : 'Continue with Google'}
			</Button>
		</form>
	</nav>
</header>
<pre class="max-w-md overflow-auto">{JSON.stringify(data, null, 2)}</pre>
<main class="">
	<slot />
</main>
