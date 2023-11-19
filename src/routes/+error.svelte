<script lang="ts">
	import { page } from '$app/stores';
	import { HomeIcon } from 'lucide-svelte';
</script>

<section class="max-w-5xl mt-10 w-full flex items-center justify-center">
	<div class="p-6 flex flex-col gap-y-6 rounded-xl select-none">
		<h1
			class="pl-2 text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-layer-11"
		>
			{$page.status}
		</h1>
		<h4 class="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-layer-10">
			Page {$page.error?.message}
		</h4>
		<a
			href="/"
			class="text-layer-11 font-bold px-3 py-1 w-max text-xl bg-layer-3 hover:bg-layer-4 transition-colors rounded-md flex items-center gap-x-2"
		>
			<span class="leading-6">home</span>
		</a>
	</div>
</section>
