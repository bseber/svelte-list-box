<script lang="ts">
	import { getContext } from "svelte";
	import type { Readable, Writable } from "svelte/store";

	export let id: string;
	export let activeClass: string;

	let listItem: HTMLLIElement;

	const selectedItemStore = getContext<Writable<HTMLElement>>("selectedItem");
	const activeItemStore = getContext<Readable<HTMLElement>>("activeItem");
	const expandedStore = getContext<Writable<HTMLElement>>("expanded");
	const selectItem = getContext<(element: HTMLElement) => void>("itemSelected");
	const focusItem = getContext<(element?: HTMLElement) => void>("itemFocused");

	$: isSelected = $activeItemStore === listItem;

	$: {
		if (listItem) {
			if ($selectedItemStore === listItem || $activeItemStore === listItem) {
				listItem.classList.add(...activeClass.split(" "));
			} else {
				listItem.classList.remove(...activeClass.split(" "));
			}
		}
	}

	function handleClick(event: MouseEvent) {
		event.stopPropagation();
		selectItem(listItem);
	}

	function handleMouseEnter() {
		focusItem(listItem);
	}

	function handleMouseLeave() {
		// ignore it when mouse event has been triggered due to body click which hides the ListBox.
		if ($expandedStore) {
			// nothing focused anymore
			focusItem();
		}
	}

	function handleMouseMove() {
		focusItem(listItem);
	}
</script>

<li
	role="option"
	{id}
	class={$$props.class ?? ""}
	aria-selected={isSelected}
	on:click={handleClick}
	on:mouseenter={handleMouseEnter}
	on:mouseleave={handleMouseLeave}
	on:mousemove={handleMouseMove}
	bind:this={listItem}
>
	<slot />
</li>

<style>
	li {
		cursor: default;
	}
</style>
