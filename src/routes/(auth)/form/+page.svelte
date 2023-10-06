<script lang="ts">
	import type { PageData } from './$types';
	import VerifyForm from './verify-form.svelte';
	import InfoForm from './info-form.svelte';

	export let data: PageData;
	export let form;
</script>

<!-- <pre>{JSON.stringify(, null, 2)}</pre> -->
<div class="flex items-center w-full justify-center p-2">
	{#if !form?.verified}
		{#if !form?.infoForm?.data.phone_number}
			<InfoForm form={data.infoForm} />
		{:else}
			<VerifyForm form={data.verifyForm} />
		{/if}
	{:else}
		<div>Phone Number is Verified!</div>
	{/if}
</div>
