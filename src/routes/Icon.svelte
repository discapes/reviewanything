<script lang="ts">
	let { icon, clazz, scale = 1 }: { icon: string; clazz: string; scale?: number } = $props();
</script>

<img
	src="data:image/svg+xml;base64,{btoa(icon)}"
	width={24 * scale}
	height={24 * scale}
	class={clazz}
	alt="svg icon"
/>
