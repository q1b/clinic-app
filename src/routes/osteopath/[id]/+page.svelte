<script lang="ts">
	import { page } from '$app/stores';
	import View from './slot-view.svelte';
	import LoginForm from '$routes/(auth)/login/form.svelte';
	import SignupForm from '$routes/(auth)/signup/form.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Dialog from '$lib/components/ui/dialog';
	import type { PageData } from './$types';
	import { ArrowRightCircleIcon, Edit, Edit2, FileEditIcon, PencilIcon } from 'lucide-svelte';

	export let data: PageData;

	$: osteopathUserId = data.osteopathUser.id;
	$: osteopathId = $page.params.id;
	$: userId = data.user.id;

	let dialogOpen = false;
	let tab: 'signup' | 'login' = 'signup';
</script>

<div class="flex flex-col items-center gap-y-12">
	{#if userId !== osteopathUserId}
		<div
			class="flex items-center px-3 py-2 rounded-full w-max shadow-inner shadow-layer-5 border border-layer-6 gap-x-2"
		>
			<img src={data.osteopathUser?.image} width={42} height={42} class="rounded-full" alt="" />
			<h3 class="text-lg">{data.osteopathUser?.name}</h3>
		</div>
	{/if}
	<View
		bydates={data.by.dates}
		on:book={async (e) => {
			const response = await fetch(`/osteopath/${osteopathId}/api/`, {
				method: 'POST',
				body: JSON.stringify({
					...e.detail,
					osteopathUserId,
					osteopathId,
					userId
				}),
				headers: {
					'content-type': 'application/json'
				}
			});
			console.log(await response.json());
			if (!data.isLogged) dialogOpen = true;
		}}
	/>
	{#if userId === osteopathUserId}
		<div class="w-full flex items-center justify-center">
			<a
				href="/osteopath/{osteopathId}/edit"
				class="flex items-center pl-3 pr-4 py-2 rounded-full w-max shadow-inner shadow-layer-5 border border-layer-6 group hover:scale-95 transition-all"
			>
				<Edit class="group-hover:scale-95 transition-transform" />
				<span class="mr-2 ml-1 text-xl scale-105 transition-transform group-hover:scale-100 mt-0.5">
					Edit
				</span>
				<ArrowRightCircleIcon
					class="group-hover:translate-x-0.5 group-active:translate-x-1 transition-transform "
				/>
			</a>
		</div>
	{/if}
</div>
<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content class="min-h-[534px]">
		<Tabs.Root bind:value={tab}>
			<Tabs.List class="flex children:grow w-full">
				<Tabs.Trigger value="signup">Signup</Tabs.Trigger>
				<Tabs.Trigger value="login">Login</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="signup">
				<div class="pt-6"></div>
				<SignupForm
					on:click={() => {
						tab = 'login';
					}}
				/>
			</Tabs.Content>
			<Tabs.Content value="login">
				<div class="pt-6"></div>
				<LoginForm
					redirect={false}
					on:load={(e) => {
						if (e.detail.validated) {
							dialogOpen = false;
							data.isLogged = true;
						}
					}}
					on:click={() => {
						tab = 'signup';
					}}
				/>
			</Tabs.Content>
		</Tabs.Root>
	</Dialog.Content>
</Dialog.Root>
