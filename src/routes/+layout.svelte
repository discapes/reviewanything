<script lang="ts">
	import './tailwind.css';
	import './simple.css'; // tailwind's reset sheet removes a bit too much, this is better
	import './app.css';
	import Keycloak from 'keycloak-js';
	import { browser } from '$app/environment';
	import { invalidateAll } from '$app/navigation';
	import iLogout from '$svg/mdi/logout.svg?raw';
	import iLogin from '$svg/fluent-mdl2/signin.svg?raw';
	import iGear from '$svg/ph/gear-six-fill.svg?raw';
	import { PUBLIC_KC_URL } from '$env/static/public';
	import Icon from './Icon.svelte';

	let { data } = $props();
	let { userInfo } = $derived(data);
	let kc: Keycloak;

	if (browser) {
		kc = new Keycloak({
			url: PUBLIC_KC_URL,
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
	{#if userInfo}
		<div class="flex items-center justify-center gap-3">
			<span>Welcome back, {userInfo.given_name}</span>
			<button class="m-0! text-sm!" onclick={() => kc.accountManagement()}>
				<Icon scale={0.75} class="invert" icon={iGear} />
				Account settings
			</button>
			<button class="m-0! text-sm!" onclick={logout}>
				<Icon scale={0.75} class="invert" icon={iLogout} />
				Log out
			</button>
		</div>
	{:else}
		<button onclick={() => kc.login()}>
			<Icon class="invert" icon={iLogin} />
			Log in / Register
		</button>
	{/if}
</header>
<main class="">
	<slot />
</main>
<footer>
	<p>Built with ♥ by M</p>
</footer>
