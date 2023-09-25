<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowRightIcon } from 'lucide-svelte';

	export let data;
</script>

<h1 class="text-xl font-bold m-4">Students</h1>
<ul class="flex flex-col gap-y-3">
	{#each data.users as user}
		<li class="p-4 shadow flex gap-x-2">
			<img src={user.image} alt="" />
			<div class="flex flex-col">
				<h3 class="">
					{user.name}
				</h3>
				<h4>{user.email}</h4>
				<a href={`/students/student/${user.id}`} class="w-max mt-auto underline flex items-center">
					Check out <ArrowRightIcon />
				</a>
			</div>
		</li>
	{/each}
</ul>
