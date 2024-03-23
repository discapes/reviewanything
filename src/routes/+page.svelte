<script lang="ts">
	import { enhance } from '$app/forms';
	import { text } from '@sveltejs/kit';

	let { data, form } = $props();
	let { total, reviews } = $derived(data);
	$effect(() => void (form?.error && alert(form.error)));

	let thingText = $state('');
	let reviewText = $state('');
	let long = $state(false);
	let textarea = $state<HTMLTextAreaElement>();
	let input = $state<HTMLInputElement>();

	$effect(() => {
		if (reviewText.length > 30) {
			long = true;
			setTimeout(() => textarea?.focus(), 0);
		} else if (reviewText.length < 30) {
			long = false;
			setTimeout(() => input?.focus(), 0);
		}
	});
</script>

<div>
	<form method="post" use:enhance action="?/sendreview">
		<input
			required
			autocapitalize="none"
			pattern="[a-zA-Z0-9 ]*"
			maxlength="100"
			name="subject"
			placeholder="Thing"
			bind:value={thingText}
		/>
		<textarea
			required
			name={long ? 'text' : undefined}
			class:hidden!={!long}
			placeholder="What's {thingText?.toLowerCase() || 'it'} like?"
			maxlength="5000"
			bind:value={reviewText}
			bind:this={textarea}
		>
		</textarea>
		<input
			required
			name={!long ? 'text' : undefined}
			class:hidden!={long}
			placeholder="What's {thingText?.toLowerCase() || 'it'} like?"
			maxlength="5000"
			bind:value={reviewText}
			bind:this={input}
		/>
		<input type="submit" value="Submit review" />
	</form>
</div>

<h4>All reviews ({total} total)</h4>
<div class="flex flex-col gap-4">
	{#each reviews as review}
		<div class="bg-stone-200 notice m-0! gap-3 flex flex-col">
			<div class="flex justify-between">
				<b><a href="/things/{review.subject}">{review.subject}</a></b>
				<span class="text-stone-500">{review.date.toLocaleString()}</span>
			</div>
			<span>{review.text}</span>
		</div>
	{/each}
</div>
