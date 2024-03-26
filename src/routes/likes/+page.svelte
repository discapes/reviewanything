<script lang="ts">
	import Icon from '../Icon.svelte';
	import iHeart from '$svg/mdi/heart.svg?raw';
	import iHeartOutline from '$svg/mdi/heart-outline.svg?raw';
	import ReviewView from '../ReviewView.svelte';

	const { data } = $props();
	const { total, reviews } = $derived(data);
</script>

<div class="flex justify-between items-center">
	<h2>All liked reviews ({total})</h2>
	<a href="/things">All things</a>
</div>

{#if reviews}
	<div class="flex flex-col gap-4">
		{#each reviews as review (review.uuid)}
			<ReviewView {review}></ReviewView>
		{/each}
	</div>
{:else}
	Log in
{/if}
