import { $$ } from "./helpers.js"

export function bindToggles(rootNode, dispatch) {
  const toggles = $$(rootNode, `[x-toggle]`)

  for (const toggle of toggles) {
    toggle.hidden = false
    toggle.addEventListener("click", () => {
      const id = toggle.getAttribute("x-toggle")
      const ariaExpanded = toggle.getAttribute("aria-expanded") === "true"
      dispatch({
        type: "SET",
        payload: {
          name: `__xToggles__.${id}`,
          value: !ariaExpanded,
        },
      })
    })
  }
}
