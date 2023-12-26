<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { MoreHorizontal } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	let loading = false;
	let upgrading = false;
	export let id: string;
	export let isOsteopath: boolean;
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button
			variant="ghost"
			builders={[builder]}
			icon={MoreHorizontal}
			size="icon"
			class="relative w-8 h-8 p-0"
		>
			<span class="sr-only">Open menu</span>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Label>Actions</DropdownMenu.Label>
			<DropdownMenu.Item on:click={() => navigator.clipboard.writeText(id)}>
				Copy User ID
			</DropdownMenu.Item>
			<DropdownMenu.Item asChild>
				<form
					method="post"
					action="?/upgrade"
					use:enhance={() => {
						upgrading = true;
						return async ({ update }) => {
							await update();
							upgrading = false;
						};
					}}
				>
					<input type="hidden" name="user-id" id="user-id" value={id} />
					<Button
						variant="ghost"
						type="submit"
						disabled={upgrading || isOsteopath}
						class="py-0 px-2 w-full cursor-default h-8 inline-flex items-center justify-start"
					>
						{isOsteopath ? 'Downgrade' : 'Upgrade'}
					</Button>
				</form>
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item asChild>
			<form
				method="post"
				action="?/create"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						await update();
						loading = false;
					};
				}}
			>
				<input type="hidden" name="user-id" id="user-id" value={id} />
				<Button
					variant="link"
					type="submit"
					disabled={true}
					class="py-0 px-2 text-rose-500 data-[highlighted]:text-rose-600 hover:bg-rose-500/10 cursor-default"
				>
					Delete Account
				</Button>
			</form>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
