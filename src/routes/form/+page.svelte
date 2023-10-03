<script lang="ts">
	import type { PageData } from './$types';
	import UsernameForm from './username-form.svelte';

	export let data: PageData;
	export let form;
</script>

<pre>{JSON.stringify(form, null, 2)}</pre>
<div class="p-10 flex items-center justify-center">
	<UsernameForm form={data.form} />
</div>
