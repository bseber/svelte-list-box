type Arguments = {
	target: string | HTMLElement;
};

export function portal(
	node,
	{ target }: Arguments,
): { update: () => void; destroy: () => void } {
	node.hidden = true;

	function update(): void {
		const targetElement: Element =
			typeof target === "string" ? document.querySelector(target) : target;

		if (targetElement) {
			targetElement.append(node);
			node.hidden = false;
		}
	}

	function destroy(): void {
		node.remove();
	}

	update();

	return {
		update,
		destroy,
	};
}
