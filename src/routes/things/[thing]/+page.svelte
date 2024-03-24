<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let { thing, reviews, total } = $derived(data);
	$effect(() => void (form?.error && alert(form.error)));

	let long = $state(false);
	let textarea = $state<HTMLTextAreaElement>();
	let input = $state<HTMLInputElement>();
	let reviewText = $state('');

	$effect(() => {
		if (reviewText.length == 31) {
			long = true;
			setTimeout(() => textarea?.focus(), 0);
		} else if (reviewText.length == 29) {
			long = false;
			setTimeout(() => input?.focus(), 0);
		}
	});
</script>

<div class="flex items-center">
	<form method="post" use:enhance action="?/sendreview" class="m-auto! inline-block">
		<textarea
			required
			name={long ? 'text' : undefined}
			class:hidden!={!long}
			placeholder="How's {thing}?"
			maxlength="5000"
			bind:value={reviewText}
			bind:this={textarea}
		>
		</textarea>
		<input
			required
			name={!long ? 'text' : undefined}
			class:hidden!={long}
			placeholder="How's {thing}?"
			maxlength="5000"
			bind:value={reviewText}
			bind:this={input}
		/>
		<input type="submit" value="Submit review" />
	</form>
</div>

<div class="flex justify-between items-center">
	<h2>All reviews for {thing} ({total})</h2>
	<a href="/things">All things</a>
</div>
<div class="flex flex-col gap-4">
	{#each reviews as review}
		<div class="bg-stone-200 notice m-0! flex-col flex gap-3">
			<span>{review.text}</span>
			<span class="text-stone-500">{review.date.toLocaleString()}</span>
		</div>
	{/each}
</div>
