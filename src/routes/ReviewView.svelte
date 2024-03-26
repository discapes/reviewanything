<script lang="ts">
	import Icon from './Icon.svelte';
	import iHeart from '$svg/mdi/heart.svg?raw';
	import iHeartOutline from '$svg/mdi/heart-outline.svg?raw';
	import type { Review } from '$lib/server/db';
	import { invalidateAll } from '$app/navigation';

	const { review }: { review: Review } = $props();

	async function like(review: Review & { is_liked: boolean }) {
		const fd = new FormData();
		fd.append('reviewUuid', review.uuid);
		review.is_liked = !review.is_liked;
		await fetch('/?/likeReview', {
			method: 'POST',
			body: fd
		});
		invalidateAll();
	}
</script>

<div class="bg-stone-200 notice m-0! gap-3 flex flex-col overflow-clip">
	<div class="flex justify-between">
		<b><a href="/things/{review.subject}">{review.subject}</a></b>
		<span class="dark:text-stone-400 text-stone-600">{review.date.toLocaleString()}</span>
		<span>{review.total_likes}</span>
		<button class="bg-transparent! border-0! p-0! hover:scale-125" onclick={() => like(review)}>
			<Icon icon={review.is_liked ? iHeart : iHeartOutline}></Icon></button
		>
	</div>
	<span>{review.text}</span>
</div>
