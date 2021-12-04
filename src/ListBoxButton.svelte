<script lang="ts">
	import { getContext, onMount } from "svelte";
	import type { Writable } from "svelte/store";

	let buttonElement: HTMLButtonElement;

	const listBoxKey = getContext<string>("key");
	const labelStore = getContext<Writable<HTMLElement>>("labelRef");
	const buttonStore = getContext<Writable<HTMLElement>>("buttonRef");
	const expandedStore = getContext<Writable<boolean>>("expanded");

	$: labelId = $labelStore?.getAttribute("id") ?? "";
	$: buttonId = $buttonStore?.getAttribute("id") ?? "";
	$: labelledBy = `${labelId} ${buttonId}`;

	function handleClick() {
		expandedStore.set(!$expandedStore);
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === "ArrowDown" || event.key === "ArrowUp") {
			expandedStore.set(true);
		}
	}

	onMount(function () {
		buttonStore.set(buttonElement);
	});
</script>

<button
	type="button"
	id="{listBoxKey}-button"
	aria-expanded={$expandedStore}
	aria-haspopup="listbox"
	aria-labelledby={labelledBy}
	class={$$props.class ?? ""}
	on:click={handleClick}
	on:keydown={handleKeyDown}
	bind:this={buttonElement}
>
	<slot />
</button>
