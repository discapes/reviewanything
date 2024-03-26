<script lang="ts">
	let { data, form } = $props();
	let { things, total } = $derived(data);
</script>

<h2>All things ({total})</h2>
<div class="flex flex-col gap-4">
	{#each things as thing}
		<span><a href="/things/{thing.name}">{thing.name} </a>&nbsp;({thing.count})</span>
	{/each}
</div>
