import {
  BINDING_ATTRIBUTE_NAME,
  BINDING_ATTRIBUTE_SELECTOR,
} from "./constants.js"

import { listSync } from "./list.js"

export function deriveSubscribers(rootNode, initialState) {
  const nodes = [...rootNode.querySelectorAll(BINDING_ATTRIBUTE_SELECTOR)]

  const byPath = {}

  for (const node of nodes) {
    const path = node.getAttribute(BINDING_ATTRIBUTE_NAME)

    if (path.endsWith(".*")) {
      const { id } = node.dataset

      if (!id) {
        console.warn(
          `list node with no data-id attribute. any changes to state will not be reflected in the DOM`,
          node
        )
        continue
      }

      const k = path.slice(0, -2)
      if (byPath[k]) continue

      byPath[k] = (state) => {
        listSync(rootNode, path, state[k])
      }
    }
  }

  return Object.values(byPath)
}
