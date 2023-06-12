import { write } from "./xo.js"
import { listSync, listItems, listData } from "./list.js"
import {} from "./helpers.js"

export function xNode(rootNode, node) {
  return (state, config) => {
    let k = node.getAttribute("x-node")

    let index

    const collection = [...rootNode.querySelectorAll(`[x-node="${k}"]`)]
    index = collection.findIndex((n) => n === node)

    const fn = config.node?.[k]

    if (!fn) return

    const props = fn(state, index)

    write(node, props)
  }
}

export function xList(name, node) {
  return (state) => {
    const items = listItems(node)
    listSync(items, listData(items), state[name])
  }
}
