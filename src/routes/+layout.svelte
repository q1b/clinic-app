<script>
	import { page } from '$app/stores';
	import Header from '$lib/components/header.svelte';
	import '../app.postcss';
</script>

<svelte:head>
	<title>Osteopath Student</title>
</svelte:head>

<Header />
<pre> {JSON.stringify($page, null, 2)} </pre>
<main class="">
	<slot />
</main>
