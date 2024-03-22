<script lang="ts">
	let { data } = $props();
	let { title, reviews } = $derived(data);
</script>

<h1>{title}</h1>
<div>
	<h3>Reviews</h3>
	<div>
		{#each reviews as review}
			<div>
				<p>{review.subject}</p>
				<p>{review.text}</p>
			</div>
		{/each}
	</div>
</div>
