<script lang="ts">
	import { portal } from "./portal";
	import { afterUpdate, getContext, tick } from "svelte";
	import type { Writable } from "svelte/store";
	import { get, Readable } from "svelte/store";

	type FocusItemOptions = {
		scrollIntoView: boolean;
	};

	const listBoxStore = getContext<Readable<HTMLElement>>("listBoxRef");
	const labelStore = getContext<Writable<HTMLElement>>("labelRef");
	const buttonStore = getContext<Writable<HTMLElement>>("buttonRef");
	const expandedStore = getContext<Writable<boolean>>("expanded");
	const selectedItemStore = getContext<Writable<HTMLElement>>("selectedItem");
	const activeItemStore = getContext<Readable<HTMLElement>>("activeItem");
	const selectItem = getContext<(element: HTMLElement) => void>("itemSelected");
	const focusItem =
		getContext<(element: HTMLElement, options: FocusItemOptions) => void>(
			"itemFocused",
		);
	const resetAndClose = getContext<() => void>("resetAndClose");

	let containerElement: HTMLElement;
	let listElement: HTMLElement;

	// focus list when it is visible due to expanded ListBox.
	$: $expandedStore && tick().then(() => listElement.focus());

	$: labelledBy =
		$labelStore?.getAttribute("id") ?? $buttonStore?.getAttribute("id");

	$: {
		if ($expandedStore) {
			const { top, left, width } = get(listBoxStore).getBoundingClientRect();
			const { height: buttonHeight } = get(buttonStore).getBoundingClientRect();
			// ListBoxOptions is scrollable when it's height overflows the window.
			// ListBoxOptions is appended to document.body
			// set position fixed and position ListBoxOptions below the ListBoxButton
			containerElement.style.position = "fixed";
			containerElement.style.top = `${top + buttonHeight + 2}px`;
			containerElement.style.left = `${left}px`;
			containerElement.style.width = `${width}px`;
		}
	}

	function focusFirstItem(options: FocusItemOptions) {
		const firstItem = listElement.querySelector(
			"[role='option']",
		) as HTMLElement;
		if (firstItem) {
			focusItem(firstItem, options);
		}
	}

	function focusLastItem(options: FocusItemOptions) {
		const lastItem = listElement.querySelector(
			"[role='option']:last-of-type",
		) as HTMLElement;
		if (lastItem) {
			focusItem(lastItem, options);
		}
	}

	function handleListBoxOptionsFocus() {
		if (!$activeItemStore) {
			focusFirstItem({ scrollIntoView: true });
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === "Tab") {
			event.preventDefault();
			return;
		}

		if ($activeItemStore) {
			switch (event.key) {
				case "PageUp": {
					focusFirstItem({ scrollIntoView: true });
					break;
				}
				case "PageDown": {
					focusLastItem({ scrollIntoView: true });
					break;
				}
				case "ArrowUp": {
					if (event.metaKey) {
						focusFirstItem({ scrollIntoView: true });
					} else {
						const nextActive =
							$activeItemStore.previousElementSibling as HTMLElement;
						if (nextActive) {
							focusItem(nextActive, { scrollIntoView: true });
						}
					}
					break;
				}
				case "ArrowDown": {
					if (event.metaKey) {
						focusLastItem({ scrollIntoView: true });
					} else {
						const nextActive =
							$activeItemStore.nextElementSibling as HTMLElement;
						if (nextActive) {
							focusItem(nextActive, { scrollIntoView: true });
						}
					}
					break;
				}
				case "Enter":
				case " ": {
					selectItem($activeItemStore);
					break;
				}
				case "Escape": {
					resetAndClose();
					break;
				}
			}
		}
	}

	function handleMouseLeave() {
		// ignore it when mouse event has been triggered due to body click which hides the ListBox.
		if ($expandedStore) {
			focusItem($selectedItemStore, { scrollIntoView: false });
		}
	}

	function checkHeight() {
		if (containerElement) {
			const { top, height } = containerElement.getBoundingClientRect();
			const innerHeight = window.innerHeight;
			if (top + height >= innerHeight) {
				containerElement.style.height = `${innerHeight - top}px`;
				containerElement.style.overflowY = "scroll";
			} else {
				containerElement.style.height = "";
				containerElement.style.overflow = "";
			}
		}
	}

	function handleResize() {
		checkHeight();
	}

	afterUpdate(function () {
		checkHeight();
	});
</script>

<svelte:window on:resize={handleResize} />

<div
	style="z-index: 99999;"
	use:portal={{ target: document.body }}
	class:hidden={!$expandedStore}
	bind:this={containerElement}
>
	<ul
		role="listbox"
		tabindex="-1"
		class={$$props.class ?? ""}
		aria-labelledby={labelledBy}
		aria-activedescendant={$activeItemStore?.id}
		on:focus={handleListBoxOptionsFocus}
		on:keydown|preventDefault={handleKeyDown}
		on:mouseleave={handleMouseLeave}
		bind:this={listElement}
	>
		<slot />
	</ul>
</div>

<style>
	ul {
		width: 100%;
	}
</style>
