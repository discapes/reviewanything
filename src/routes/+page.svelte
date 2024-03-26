<script lang="ts">
	import ReviewView from './ReviewView.svelte';

	let { data, form } = $props();
	let { total, reviews } = $derived(data);
	$effect(() => void (form?.error && alert(form.error)));
</script>

<div class="flex justify-between items-center">
	<h2 class="">All reviews ({total})</h2>
	<a href="/things">All things</a>
</div>
<div class="flex flex-col gap-4">
	{#each reviews as review (review.uuid)}
		<ReviewView {review}></ReviewView>
	{/each}
</div>
