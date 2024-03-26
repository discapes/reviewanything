<script lang="ts">
	import { enhance } from '$app/forms';
	import iHeart from '$svg/mdi/heart.svg?raw';
	import iHeartOutline from '$svg/mdi/heart-outline.svg?raw';
	import Icon from './Icon.svelte';
	import { invalidate, invalidateAll } from '$app/navigation';
	import type { Review } from '$lib/server/db';

	let { data, form } = $props();
	let { total, reviews } = $derived(data);
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

	async function like(review: Review & { is_liked: boolean }) {
		const fd = new FormData();
		fd.append('reviewUuid', review.uuid);
		review.is_liked = !review.is_liked;
		await fetch('?/likeReview', {
			method: 'POST',
			body: fd
		});
	}
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

<div class="flex justify-between items-center">
	<h2 class="">All reviews ({total})</h2>
	<a href="/things">All things</a>
</div>
<div class="flex flex-col gap-4">
	{#each reviews as review (review.uuid)}
		<div class="bg-stone-200 notice m-0! gap-3 flex flex-col overflow-clip">
			<div class="flex justify-between">
				<b><a href="/things/{review.subject}">{review.subject}</a></b>
				<span class="dark:text-stone-400 text-stone-600">{review.date.toLocaleString()}</span>
				<button class="bg-transparent! border-0! p-0!" onclick={() => like(review)}>
					<Icon icon={review.is_liked ? iHeart : iHeartOutline}></Icon></button
				>
			</div>
			<span>{review.text}</span>
		</div>
	{/each}
</div>
