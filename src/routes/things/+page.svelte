<script lang="ts">
	let { data, form } = $props();
	let { things, total } = $derived(data);
</script>

<div class="flex justify-between items-center">
	<h2>All things({total})</h2>
	<a href="/">All reviews</a>
</div>
<div class="flex flex-col gap-4">
	{#each things as thing}
		<span><a href="/things/{thing.name}">{thing.name} </a>&nbsp;({thing.count})</span>
	{/each}
</div>
