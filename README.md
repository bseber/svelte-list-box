# svelte-list-box

A svelte listbox component for [svelte](https://svelte.dev).

Kudos:

- https://github.com/tailwindlabs/headlessui/tree/main/packages/%40headlessui-vue/src/components/listbox
- https://www.w3.org/TR/wai-aria-practices/examples/listbox/listbox-collapsible.html

Note: Not battle-tested yet. Proof of concept usage in one project, currently.

## Features

- Becomes scrollable when it would overflow the window
- Navigate with keyboard (`ArrowDown`, `ArrowUp`, `PageUp`, `PageDown`, ...)

## Examples

Basic usage:

```handlebars
<script lang="ts">
	const items = [
		{ id: "1", label: "Batman" },
		{ id: "2", label: "Superman" },
		{ id: "3", label: "Aquaman" },
	];

	let selectedElementId = "1";

	$: selectedLabel = items.find(item => item.id === selectedElementId).label;

	function handleSelect(event: CustomEvent) {
		selectedElementId = event.detail.value;
	}
</script>

<ListBox value="{selectedElementId}" on:select="{handleSelect}">
	<ListBoxLabel>Choose something:</ListBoxLabel>
	<ListBoxButton>{selectedLabel}</ListBoxButton>
	<ListBoxOptions>
		{#each items as item}
		<ListBoxOption id="{item.id}">
			{#if selectedElementId === item.id} -- {/if} {item.label}
		</ListBoxOption>
		{/each}
	</ListBoxOptions>
</ListBox>
```

Use the exposed `expanded` value to hide `ListOption` content until it is expanded.

```handlebars
<ListBox let:expanded>
	<ListBoxLabel>Choose something:</ListBoxLabel>
	<ListBoxButton>{selectedLabel}</ListBoxButton>
	<ListBoxOptions>
		{#each items as item}
		<ListBoxOption id="{item.id}">
			{#if expanded}render something expensive only when ListOptions are expanded{/if}
		</ListBoxOption>
		{/each}
	</ListBoxOptions>
</ListBox>
```
