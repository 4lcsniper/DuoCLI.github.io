// Listen for messages from content.js
window.addEventListener("message", (event) => {
	if (event.source !== window || !event.data || event.data.type !== "RENDER_KATEX") return;

	if (window.katex) {
		const container = document.querySelector(event.data.target) || document.body;

		// Keep the existing text and only replace LaTeX portions
		container.innerHTML = event.data.latex.replace(
			/\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g, // Regex to match $$...$$ (block) or $...$ (inline)
			(match, displayMath, inlineMath) => {
				const span = document.createElement("span");
				span.classList.add("katex-rendered");

				try {
					if (displayMath) {
						window.katex.render(displayMath, span, { displayMode: true, throwOnError: false });
					} else {
						window.katex.render(inlineMath, span, { displayMode: false, throwOnError: false });
					}
				} catch (e) {
					console.error("KaTeX render error:", e);
					span.textContent = match; // Fallback: show original text if there's an error
				}

				return span.outerHTML;
			}
		);
	} else {
		console.error("KaTeX is not available.");
	}
});
