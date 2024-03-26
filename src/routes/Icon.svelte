<script lang="ts">
	let clazz: string = '';
	export { clazz as class };
	export let icon: string;
	export let scale: number = 1;
</script>

<img
	src="data:image/svg+xml;base64,{btoa(icon)}"
	width={24 * scale}
	height={24 * scale}
	class={clazz}
	alt="svg icon"
/>
