<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { toast } from 'svelte-sonner';
	import { formSchema, type FormSchema } from './schema';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { Loader2Icon } from 'lucide-svelte';
	import { enhance } from '$app/forms';

	export let form: SuperValidated<FormSchema>;
</script>

<Form.Root method="POST" {form} schema={formSchema} let:config let:submitting>
	<Form.Field {config} name="username">
		<Form.Item>
			<Form.Label>Username</Form.Label>
			<Form.Input />
			<Form.Description>This is your public display name.</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Button>
		{#if submitting}
			<Loader2Icon />
		{/if}
		Submit
	</Form.Button>
</Form.Root>
