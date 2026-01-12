<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	let fallback = $state($page.data.thing);
	let thingText = $state($page.data.thing);
	let reviewText = $state('');
	let long = $state(false);
	let textarea = $state<HTMLTextAreaElement>();
	let input = $state<HTMLInputElement>();

	page.subscribe((p) => ((fallback = p.data.thing), (thingText = p.data.thing)));

	$effect(() => {
		if (reviewText.length == 31) {
			long = true;
			setTimeout(() => textarea?.focus(), 0);
		} else if (reviewText.length < 31 && long) {
			long = false;
			setTimeout(() => input?.focus(), 0);
		}
	});
</script>

<div class="flex items-center">
	<form method="post" use:enhance action="/?/sendreview" class="m-auto! inline-block">
		<input
			required
			autocapitalize="none"
			pattern="[a-zA-Z0-9 ]*"
			maxlength="40"
			name="subject"
			placeholder={fallback || 'something'}
			bind:value={thingText}
		/>
		<textarea
			required
			name={long ? 'text' : undefined}
			class:hidden!={!long}
			placeholder="what's {thingText?.toLowerCase() || fallback || 'it'} like?"
			maxlength="5000"
			bind:value={reviewText}
			bind:this={textarea}
		>
		</textarea>
		<input
			required
			name={!long ? 'text' : undefined}
			class:hidden!={long}
			placeholder="what's {thingText?.toLowerCase() || fallback || 'it'} like?"
			maxlength="5000"
			bind:value={reviewText}
			bind:this={input}
		/>
		<input type="submit" value="Submit review" />
	</form>
</div>
