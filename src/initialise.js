import { walk } from "./helpers.js"
import * as deriveState from "./deriveState.js"
import * as deriveSubscribers from "./deriveSubscribers.js"
import * as bindEvents from "./bindEvents.js"
import { listItems, listData } from "./list.js"

/* skip any custom elements  */
const cwalk = (node, callback) => {
  callback(node)
  walk(node.firstChild, (node) => {
    if (node.nodeName.includes("-")) {
      return node.nextSibling || node.parentNode.nextSibling
    }
    callback(node)
  })
}

export function initialise(rootNode, subscribe, dispatch, config) {
  const state = {}

  cwalk(rootNode, (node) => {
    if (node.hasAttribute?.("x-list")) {
      const k = node.getAttribute("x-list")
      subscribe(deriveSubscribers.xList(k, node, config.template?.[k]))
      state[k] = listData(listItems(node))
    }
    if (node.hasAttribute?.("x-control")) {
      deriveState.xInput(node, state)
      bindEvents.xInput(node, dispatch)
    }
    if (node.hasAttribute?.("x-on")) {
      bindEvents.xOn(rootNode, node, dispatch)
    }
    if (node.hasAttribute?.("x-node")) {
      subscribe(deriveSubscribers.xNode(rootNode, node))
    }
  })

  return state
}
