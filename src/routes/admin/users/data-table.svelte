<script lang="ts">
	import { createTable, Render, Subscribe, createRender } from 'svelte-headless-table';
	import { readable } from 'svelte/store';
	import * as Table from '$lib/components/ui/table';
	import DataTableActions from './data-table-actions.svelte';
	type User = {
		id: string;
		name: string;
		email: string;
		phone_number: string;
		phone_number_verified: boolean;
		osteopath: null | { id: string };
	};
	export let data = [
		{
			id: 'asd',
			name: 'Sukhpreet Singh',
			email: 'peadevp@gmail.com',
			phone_number: '+918769514159',
			phone_number_verified: true,
			osteopath: { id: 'string' }
		},
		{
			id: 'asd',
			name: 'Sukhpreet Singh',
			email: 'peadevp@gmail.com',
			phone_number: '+918769514159',
			phone_number_verified: true,
			osteopath: null
		}
		// ...
	];
	const table = createTable(readable(data));
	const columns = table.createColumns([
		table.column({
			accessor: 'id',
			header: 'ID'
		}),
		table.column({
			accessor: 'name',
			header: 'Full Name'
		}),
		table.column({
			accessor: 'email',
			header: 'Email Address'
		}),
		table.column({
			accessor: 'phone_number',
			header: 'Phone Number'
		}),
		table.column({
			accessor: ({ osteopath }) => (osteopath?.id === undefined ? 'No' : 'Yes'),
			header: 'Bos | Mos'
		}),
		table.column({
			accessor: ({ id, osteopath }) => ({ id, isOsteopath: osteopath?.id ? true : false }),
			header: '',
			cell: ({ value: { id, isOsteopath } }) => {
				return createRender(DataTableActions, { id, isOsteopath });
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
