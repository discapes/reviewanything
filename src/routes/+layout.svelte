<script lang="ts">
	import './tailwind.css';
	import './simple.css'; // tailwind's reset sheet removes a bit too much, this is better
	import './app.css';
	import Keycloak from 'keycloak-js';
	import { browser } from '$app/environment';
	import { invalidateAll } from '$app/navigation';
	import { backIn } from 'svelte/easing';

	let { data } = $props();
	let { auth } = $derived(data);
	let kc: Keycloak;

	if (browser) {
		kc = new Keycloak({
			url: 'http://localhost:8089',
			realm: 'reviewanything',
			clientId: 'reviewanything'
		});
		kc.init({ checkLoginIframe: false }).then((auth) => {
			if (auth) {
				document.cookie = 'accessToken=' + kc.token;
				invalidateAll();
			}
		});
	}
	function logout() {
		document.cookie = 'accessToken=';
		invalidateAll();
	}
</script>

<header class="pb-3!">
	<h1 class="text-4xl! md:text-5xl!"><a href="/">reviewanything.top</a></h1>
	<p class="mt-8!">
		Review literally anything, from <a href="/things/life"><code>life</code></a> to
		<a href="/things/geometry dash"><code>Geometry Dash</code></a>
	</p>
	{#if auth}
		Welcome back, <a href="{auth.iss}/account">{auth.given_name}</a>
		<button onclick={logout}>Log out</button>
	{:else}
		<button onclick={() => kc.login()}>Log in / Register</button>
	{/if}
</header>
<main class="">
	<slot />
</main>
<footer>
	<p>Built with ♥ by M</p>
</footer>
