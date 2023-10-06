<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { infoSchema, type InfoFormSchema } from './schema';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { Loader2Icon } from 'lucide-svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	export let form: SuperValidated<InfoFormSchema>;
</script>

<Form.Root action="?/info" method="POST" {form} schema={infoSchema} let:config let:submitting>
	<Form.Field {config} name="full_name">
		<Form.Item class="mb-4">
			<Form.Label>Full Name</Form.Label>
			<Form.Input />
			<!-- <Form.Description>This is mentioned with Osteopath</Form.Description> -->
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="phone_number">
		<Form.Item class="grid grid-cols-12 gap-x-2">
			<Form.Label class="col-span-full">Phone Number</Form.Label>
			<div
				class="select-none col-span-2 w-max tabular-nums shadow-sm bg-white border border-slate-200 rounded-lg px-1.5 py-1"
			>
				+91
			</div>
			<Form.Input class="col-span-10" />
			<Form.Validation class="col-start-3 col-end-12" />
		</Form.Item>
	</Form.Field>
	<div class="flex gap-x-4">
		<Button type="button" variant="secondary" class="w-full mt-4">Cancel</Button>
		<Form.Button class="w-full mt-4" disabled={submitting}>
			{#if submitting}
				<Loader2Icon class="animate-spin w-4 h-4" />
			{/if}
			Submit
		</Form.Button>
	</div>
</Form.Root>
