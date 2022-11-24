import { listSync } from "./list.js"

export function deriveSubscribers(rootNode) {
  const nodes = [...rootNode.querySelectorAll(`[x-list]`)]

  const byPath = {}

  for (const node of nodes) {
    const k = node.getAttribute(`x-list`)

    const { id } = node.dataset

    if (!id) {
      console.warn(
        `list node with no data-id attribute. any changes to state will not be reflected in the DOM`,
        node
      )
      continue
    }

    byPath[k] = (state) => {
      listSync(rootNode, k, state[k])
    }
  }

  return Object.values(byPath)
}
