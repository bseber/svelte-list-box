<script lang="ts">
	import { getContext, onMount } from "svelte";
	import type { Writable } from "svelte/store";

	const listBoxKey = getContext<string>("key");
	const labelStore = getContext<Writable<HTMLElement>>("labelRef");

	let labelElement: HTMLElement;

	onMount(function () {
		labelStore.set(labelElement);
	});
</script>

<span id="{listBoxKey}-label" class={$$props.class} bind:this={labelElement}>
	<slot />
</span>
