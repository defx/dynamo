import { write } from "./xo.js"
import { listSync } from "./list.js"
import { castAll } from "./helpers.js"

export function xNode(rootNode, node, subscribe) {
  const callback = (state, config) => {
    let k = node.getAttribute("x-node")

    let index

    const collection = [...rootNode.querySelectorAll(`[x-node="${k}"]`)]
    index = collection.findIndex((n) => n === node)

    const fn = config.node?.[k]

    if (!fn) return

    const props = fn(state, index)

    write(node, props)
  }
  subscribe(callback)
}

export function xList(k, parentNode, subscribe) {
  subscribe((state) => {
    const listNodes = [...parentNode.querySelectorAll(`[x-each="${k}"]`)]
    const listData = listNodes.map((node) => ({
      id: node.id,
      ...castAll(node.dataset),
    }))

    listSync(listNodes, listData, state[k])
  })
}
