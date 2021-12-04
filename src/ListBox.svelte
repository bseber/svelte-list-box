<script lang="ts">
	import { createEventDispatcher, setContext, tick } from "svelte";
	import { derived, readable, writable } from "svelte/store";

	export let value: string;

	const dispatch = createEventDispatcher();

	let containerElement: HTMLElement;

	const listId = "listbox-" + randomKey();
	const labelStore = writable<HTMLElement>();
	const buttonStore = writable<HTMLElement>();
	const listStore = writable<HTMLElement>();
	const expandedStore = writable<boolean>(false);

	$: dispatch("expandedToggled", { expanded: $expandedStore });

	// selectedItem: the current value of the list-box (not the hovered/focused/active element)
	const selectedItemWritable = writable<HTMLElement>();

	// hovered/focused with mouse/keyboard
	const activeItemWritable = writable<HTMLElement>();

	setContext("key", listId);
	setContext(
		"listBoxRef",
		readable<HTMLElement>(undefined, (set) => set(containerElement)),
	);
	setContext("labelRef", labelStore);
	setContext("buttonRef", buttonStore);
	setContext("listRef", listStore);
	setContext("expanded", expandedStore);
	setContext(
		"selectedItem",
		derived(selectedItemWritable, (item) => item),
	);
	setContext(
		"selectedItemId",
		derived(selectedItemWritable, (item) => item?.getAttribute("id") ?? value),
	);
	setContext(
		"activeItem",
		derived(activeItemWritable, (item) => item),
	);
	setContext("itemSelected", handleItemSelected);
	setContext("itemFocused", handleItemFocused);
	setContext("resetAndClose", handleResetAndClose);

	function randomKey() {
		return Math.random()
			.toString(36)
			.replace(/[^a-z]+/g, "")
			.slice(0, 5);
	}

	type FocusItemOptions = {
		scrollIntoView: boolean;
		behavior?: "smooth" | "auto";
	};

	function handleItemFocused(element: HTMLElement, options?: FocusItemOptions) {
		activeItemWritable.set(element);
		if (options?.scrollIntoView) {
			tick().then(() => element.scrollIntoView({ behavior: "smooth" }));
		}
	}

	function handleItemSelected(element: HTMLElement) {
		dispatch("select", { value: element.getAttribute("id") });
		expandedStore.set(false);
		selectedItemWritable.set(element);
		activeItemWritable.set(element);
		tick().then(() => $buttonStore.focus());
	}

	function handleResetAndClose() {
		expandedStore.set(false);
		activeItemWritable.set($selectedItemWritable);
		$buttonStore.focus();
	}

	function handleBodyClick(event: MouseEvent) {
		if (event.target !== $buttonStore) {
			expandedStore.set(false);
			activeItemWritable.set($selectedItemWritable);
		}
	}
</script>

<svelte:body on:click={handleBodyClick} />

<div class={$$props.class ?? ""} bind:this={containerElement}>
	<slot expanded={$expandedStore} activeItemId={$activeItemWritable?.id} />
</div>

<style>
	div {
		position: relative;
	}
</style>
