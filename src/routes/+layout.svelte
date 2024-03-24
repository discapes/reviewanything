<script lang="ts">
	import './tailwind.css';
	import './simple.css'; // tailwind's reset sheet removes a bit too much, this is better
	import './app.css';
</script>

<header class="pb-3!">
	<h1 class="text-4xl! md:text-5xl!"><a href="/">reviewanything.top</a></h1>
	<p class="mt-8!">
		Review literally anything, from <a href="/things/life"><code>life</code></a> to
		<a href="/things/geometry dash"><code>Geometry Dash</code></a>
	</p>
</header>
<main class="">
	<slot />
</main>
<footer>
	<p>Built with ♥ by M</p>
</footer>
