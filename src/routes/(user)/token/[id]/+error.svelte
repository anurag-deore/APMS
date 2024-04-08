<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="text-3xl bg-red-50 text-red-700">
	{$page.status}: {$page.error?.message}
</div>
