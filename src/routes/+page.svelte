<script lang="ts">
	import type { PageData } from './$types';
	console.log('SERVER RENDERED');

	export let data: PageData;
	$: logged = !!data?.sessionId ? true : false;
</script>

{#if logged}
	<form method="POST" action="?/logout">
		<button>Logout</button>
	</form>
{/if}

{#if !logged}
	<form method="POST" action="?/login">
		<button>Login</button>
	</form>
{/if}
