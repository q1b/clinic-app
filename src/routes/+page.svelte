<script lang="ts">
	import { extractFromEmail } from '$lib/utils';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<main class="flex flex-col w-full max-w-5xl">
	<div class="p-2 sm:px-6 sm:py-4 bg-layer-2/50 rounded-lg">
		<h1 class="text-3xl mb-12">Available Osteopaths</h1>
		<div class="flex flex-wrap items-stretch justify-center gap-6 sm:gap-4 md:gap-10 lg:gap-12">
			{#await data.streamed.data}
				{#each Array.from({ length: 3 }) as _}
					<div
						class="flex flex-col gap-y-2 bg-layer-3 hover:bg-layer-4 transition-colors px-3 py-2 rounded-full"
					>
						<div class="flex items-center justify-between gap-x-4 w-full">
							<div class="flex gap-x-4 items-center w-full">
								<div class="w-16 h-16 bg-layer-8 rounded-full"></div>
								<div class="grow pr-4">
									<div class="h-4 bg-layer-11 rounded-full w-full mb-4"></div>
									<div class="h-3 w-32 bg-layer-9 rounded-full"></div>
								</div>
							</div>
						</div>
					</div>
				{/each}
			{:then value}
				{#each value as osteopath}
					{@const v = extractFromEmail(osteopath?.user.email)}
					<a
						href="/osteopath/{osteopath.id}"
						class="flex flex-col bg-layer-3 hover:bg-layer-4 transition-colors px-3 py-2 max-w-[168px] rounded-md relative"
					>
						{#if v?.batch}
							<span class="absolute right-2 top-2 bg-layer-0/40 rounded-full px-1">{v.batch}</span>
						{/if}
						<img src={osteopath.user.image} class="w-36 h-36 rounded-md mb-2" alt="" />
						<div class="flex flex-col relative w-full">
							<div class="overflow-auto mb-1">
								<h2 class="text-lg font-bold flex items-center gap-x-1 w-max">
									{osteopath.user.name}
								</h2>
							</div>
							{#if osteopath.user.bio}
								<p class="text-sm line-clamp-2">{osteopath.user.bio}</p>
							{:else}
								<p class="text-sm line-clamp-2 invisible">
									Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consectetur,
									repellendus, dolorum? Tempore quaerat porro enim et voluptatem? Perferendis,
									dicta!
								</p>
							{/if}
						</div>
					</a>
				{/each}
			{:catch error}
				{error.message}
			{/await}
		</div>
	</div>
</main>
