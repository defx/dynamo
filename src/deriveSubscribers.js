import {
  BINDING_ATTRIBUTE_NAME,
  BINDING_ATTRIBUTE_SELECTOR,
} from "./constants.js"

/*

what if...there are two lists bound to the same path?

*/

export function deriveSubscribers(rootNode, initialState) {
  const nodes = [...rootNode.querySelectorAll(BINDING_ATTRIBUTE_SELECTOR)]

  const byPath = {}

  for (const node of nodes) {
    const path = node.getAttribute(BINDING_ATTRIBUTE_NAME)

    if (path.endsWith(".*")) {
      const k = path.slice(0, -2)
      if (byPath[k]) continue

      let oldValue = initialState[k]

      byPath[k] = (state) => {
        const newValue = state[k]

        if (newValue !== oldValue) {
          // ...

          oldValue = newValue
        }
      }
    }
  }

  return Object.values(byPath)
}
