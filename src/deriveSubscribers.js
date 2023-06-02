import { castAll } from "./helpers.js"
import { listSync } from "./list.js"
import * as xo from "./xo.js"

function apply(o, node) {
  Object.entries(o).forEach(([k, v]) => {
    switch (k) {
      case "class": {
        node.setAttribute("class", xo.objectToClasses(v))
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
        xo.write(node, { [k]: v })
        break
      }
    }
  })
}

export function xNode(rootNode, node, subscribers = []) {
  const callback = (state, config) => {
    let k = node.getAttribute("x-node")

    let index
    if (k.endsWith(".*")) {
      const collection = [...rootNode.querySelectorAll(`[x-node="${k}"]`)]
      index = collection.findIndex((n) => n === node)
      k = k.slice(0, -2)
    }

    const fn = config.node?.[k]

    // console.log("callback", { k, fn })

    if (!fn) return

    const props = fn(state, index)

    apply(props, node)
  }
  subscribers.push(callback)
}

export function xList(_, node, listSubscribers = {}) {
  const k = node.getAttribute(`x-list`)

  const { id } = node

  if (!id) {
    console.warn(
      `list node with no id attribute. any changes to state will not be reflected in the DOM`,
      node
    )
    return
  }

  listSubscribers[k] = (state) => {
    const listNodes = [...node.parentNode.querySelectorAll(`[x-list="${k}"]`)]
    const listData = listNodes.map((node) => ({
      id: node.id,
      ...castAll(node.dataset),
    }))

    listSync(listNodes, listData, state[k])
  }
}
