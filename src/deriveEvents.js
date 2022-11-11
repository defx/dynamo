import {
  BINDING_ATTRIBUTE_NAME,
  BINDING_ATTRIBUTE_SELECTOR,
} from "./constants.js"

export function deriveEvents(node) {
  const nodes = [...node.querySelectorAll(BINDING_ATTRIBUTE_SELECTOR)].filter(
    (node) => ["SELECT"].includes(node.nodeName)
  )

  const events = {}

  for (const node of nodes) {
    const path = node.getAttribute(BINDING_ATTRIBUTE_NAME)

    events.input = events.input || []

    events.input.push({
      node,
      path,
    })
  }

  return events
}
