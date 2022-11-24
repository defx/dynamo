import { $$ } from "./helpers.js"

export function bindEvents(node, dispatch) {
  const nodes = $$(node, `[x-on]`)

  for (const node of nodes) {
    const [eventType, actionName] = node
      .getAttribute("x-on")
      .split(":")
      .map((v) => v.trim())

    node.addEventListener(eventType, (event) => {
      dispatch({
        type: actionName,
        payload: {
          event,
        },
      })
    })
  }
}
