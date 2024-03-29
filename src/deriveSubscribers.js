import { objectToClasses, write } from "./xo.js"
import { listSync } from "./list.js"
import { castAll } from "./helpers.js"

function apply(o, node) {
  Object.entries(o).forEach(([k, v]) => {
    switch (k) {
      case "class": {
        node.setAttribute("class", objectToClasses(v))
        break
      }
      case "style": {
        break
      }
      case "textContent": {
        node.textContent = v
        break
      }
      default: {
        write(node, { [k]: v })
        break
      }
    }
  })
}

export function xNode(rootNode, node, subscribe) {
  const callback = (state, config) => {
    let k = node.getAttribute("x-node")

    let index

    const collection = [...rootNode.querySelectorAll(`[x-node="${k}"]`)]
    index = collection.findIndex((n) => n === node)

    const fn = config.node?.[k]

    if (!fn) return

    const props = fn(state, index)

    apply(props, node)
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
