<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let { thing, reviews } = $derived(data);
	$effect(() => void (form?.error && alert(form.error)));
</script>

<div>
	<form method="post" use:enhance action="?/sendreview">
		<input required name="text" placeholder="How's {thing}?" />
		<input type="submit" value="Submit review" />
	</form>
</div>

<h4>All reviews for {thing}</h4>
<div class="flex flex-col gap-4">
	{#each reviews as review}
		<div class="bg-stone-200 notice m-0! flex-col flex gap-3">
			<span>{review.text}</span>
			<span class="text-stone-500">{review.date.toLocaleString()}</span>
		</div>
	{/each}
</div>
