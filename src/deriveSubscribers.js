import {
  BINDING_ATTRIBUTE_NAME,
  BINDING_ATTRIBUTE_SELECTOR,
} from "./constants.js"

import { compareKeyedLists } from "./list.js"

/*

@todo: handle multiple lists bound to the same property

*/

function updateList(nodes, delta) {
  const sibling = nodes[0].previousElementSibling
  const parent = nodes[0].parentNode

  const xnodes = delta.map((i) => nodes[i])

  sibling ? sibling.after(xnodes[0]) : parent.prepend(xnodes[0])

  let t = xnodes[0]

  delta.slice(1).forEach((i) => {
    t.after(xnodes[i])
    t = xnodes[i]
  })
}

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
          const nodes = [...rootNode.querySelectorAll(`[x-bind="${path}"]`)]
          if (delta) {
            updateList(nodes, oldValue, delta)
          }

          oldValue = newValue.slice(0)
        }
      }
    }
  }

  return Object.values(byPath)
}
