import {
  BINDING_ATTRIBUTE_NAME,
  BINDING_ATTRIBUTE_SELECTOR,
} from "./constants.js"

import { compareKeyedLists } from "./list.js"

/*

what if...there are two lists bound to the same path?

perhaps you need to stick the x-bind on a container element?

    - ideally, no - shouldn't need to restrict the html structure in that way

    so then...you need to check siblings to determine whether nodes are part of the same collection

    but if subscription is based on paths, then we would be putting that logic in the subscriber...at some point...later :)

*/

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

      let oldValue = Object.entries(initialState[k] || [])

      byPath[k] = (state) => {
        const newValue = Object.entries(state[k] || [])

        console.log({ newValue, oldValue })

        if (newValue !== oldValue) {
          const delta = compareKeyedLists("id", oldValue, newValue)

          if (delta) {
            // ...update the list
          }

          oldValue = newValue.slice(0)
        }
      }
    }
  }

  return Object.values(byPath)
}
