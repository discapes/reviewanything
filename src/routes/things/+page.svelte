<script lang="ts">
	import { enhance } from '$app/forms';
	import { text } from '@sveltejs/kit';

	let { data, form } = $props();
	let { things, total } = $derived(data);
	$effect(() => void (form?.error && alert(form.error)));

	let thingText = $state('');
	let reviewText = $state('');
	let long = $state(false);
	let textarea = $state<HTMLTextAreaElement>();
	let input = $state<HTMLInputElement>();

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
		<input
			required
			autocapitalize="none"
			pattern="[a-zA-Z0-9 ]*"
			maxlength="40"
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

<h2>All things ({total})</h2>
<div class="flex flex-col gap-4">
	{#each things as thing}
		<span><a href="/things/{thing.name}">{thing.name} </a>&nbsp;({thing.count})</span>
	{/each}
</div>
