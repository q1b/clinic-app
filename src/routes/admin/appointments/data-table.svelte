<script lang="ts">
	import { createTable, Render, Subscribe, createRender } from 'svelte-headless-table';
	import { readable } from 'svelte/store';
	import * as Table from '$lib/components/ui/table';
	import DataTableActions from './data-table-actions.svelte';
	type Appointment = {
		id: string;
		date: string | null;
		userId: string | null;
		startTime: string | null;
		duration: string | null;
		osteopathId: string;
		user: {
			name: string;
		} | null;
		osteopath: {
			user: {
				name: string;
			};
		};
	};
	export let data: Appointment[];
	const table = createTable(readable(data));
	const columns = table.createColumns([
		table.column({
			accessor: 'id',
			header: 'ID'
		}),
		table.column({
			accessor: 'date',
			header: 'Date'
		}),
		table.column({
			accessor: 'startTime',
			header: 'Starting Time'
		}),
		table.column({
			accessor: 'duration',
			header: 'Duration'
		}),
		table.column({
			accessor: ({ osteopath }) => osteopath.user.name,
			header: 'Osteopath'
		}),
		table.column({
			accessor: ({ user }) => (user?.name === undefined ? 'Null' : user.name),
			header: 'User'
		}),
		table.column({
			accessor: ({ id }) => id,
			header: '',
			cell: ({ value }) => {
				return createRender(DataTableActions, { id: value });
			}
		})
	]);
	const { headerRows, pageRows, tableAttrs, tableBodyAttrs } = table.createViewModel(columns);
</script>

<div class="rounded-md border">
	<Table.Root {...$tableAttrs}>
		<Table.Header>
			{#each $headerRows as headerRow}
				<Subscribe rowAttrs={headerRow.attrs()}>
					<Table.Row>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
								<Table.Head {...attrs}>
									{#if cell.id === 'amount'}
										<div class="text-right">
											<Render of={cell.render()} />
										</div>
										<!-- {:else if cell.id === 'email'}
										<Button variant="ghost" on:click={props.sort.toggle}>
											<Render of={cell.render()} />
											<ArrowUpDown class={'ml-2 h-4 w-4'} />
										</Button> -->
									{:else}
										<Render of={cell.render()} />
									{/if}
								</Table.Head>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Header>
		<Table.Body {...$tableBodyAttrs}>
			{#each $pageRows as row (row.id)}
				<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
					<Table.Row {...rowAttrs}>
						{#each row.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs>
								<Table.Cell {...attrs}>
									<Render of={cell.render()} />
								</Table.Cell>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
