<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { verifySchema, type VerifyFormSchema } from './schema';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { Loader2Icon } from 'lucide-svelte';

	export let form: SuperValidated<VerifyFormSchema>;
</script>

<Form.Root action="?/verify" method="POST" {form} schema={verifySchema} let:config let:submitting>
	<Form.Field {config} name="code">
		<Form.Item class="w-full">
			<Form.Label class="col-span-full">Code</Form.Label>
			<Form.Input class="w-full max-w-none" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Button class="w-full" disabled={submitting}>
		{#if submitting}
			<Loader2Icon class="animate-spin w-4 h-4" />
		{/if}
		Verify
	</Form.Button>
</Form.Root>
