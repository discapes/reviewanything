<script lang="ts">
	import { page } from '$app/stores';
	import ReviewView from '../../ReviewView.svelte';

	let { data, form } = $props();
	let { thing, reviews, total } = $derived(data);
</script>

<div class="flex justify-between items-center">
	<h2>All reviews for {thing} ({total})</h2>
	<a href="/things">All things</a>
</div>
<div class="flex flex-col gap-4">
	{#each reviews as review (review.uuid)}
		<ReviewView {review}></ReviewView>
	{/each}
</div>
