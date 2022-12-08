import { $$ } from "./helpers.js"

function findIndex(rootNode, node, query) {
  const collection = [...rootNode.querySelectorAll(query)]
  return collection.findIndex((n) => n === node)
}

export function bindEvents(rootNode, dispatch) {
  const nodes = $$(rootNode, `[x-on]`)

  for (const node of nodes) {
    const [eventType, actionName] = node
      .getAttribute("x-on")
      .split(":")
      .map((v) => v.trim())

    node.addEventListener(eventType, (event) => {
      event.stopPropagation()

      const k = event.target.getAttribute("x-attr") || ""

      const index = k.endsWith(".*")
        ? findIndex(rootNode, event.target, `[x-attr="${k}"]`)
        : null

      dispatch({
        type: actionName,
        event,
        index,
      })
    })
  }
}
