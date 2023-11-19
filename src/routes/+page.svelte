<script lang="ts">
	import type { PageData } from './$types';
	import groupBy from 'just-group-by';

	export let data: PageData;
	$: osteopaths = groupBy(data.osteopaths, (osteopath) => osteopath.appointments.length !== 0);
</script>

<h1 class="text-3xl mb-8">Osteopaths</h1>
<div
	class="w-full max-w-5xl grid sm:grid-cols-2 md:grid-cols-3 gap-y-6 sm:gap-4 md:gap-10 lg:gap-12 px-2 xs:px-4"
>
	{#each osteopaths['true'] as osteopath}
		<a
			href="/osteopath/{osteopath.id}"
			class="flex flex-col gap-y-2 bg-layer-3 hover:bg-layer-4 transition-colors px-3 py-2 rounded-full"
		>
			<div class="flex items-center justify-between gap-x-4">
				<div class="flex gap-x-4 items-center">
					<img src={osteopath.user.image} width={64} height={64} class="rounded-full" alt="" />
					<div class="flex flex-col relative">
						<h2 class="text-lg font-bold flex items-center gap-x-1">
							{osteopath.user.name}
						</h2>
						{#if osteopath.user.bio}
							<p class="text-sm line-clamp-2">{osteopath.user.bio}</p>
						{:else}
							<p class="text-sm line-clamp-2 invisible">
								Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consectetur, repellendus,
								dolorum? Tempore quaerat porro enim et voluptatem? Perferendis, dicta!
							</p>
						{/if}
					</div>
				</div>
			</div>
		</a>
	{/each}
</div>
<!-- <pre>{JSON.stringify(osteopaths[], null, 2)}</pre> -->
