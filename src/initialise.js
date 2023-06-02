import { walk } from "./helpers.js"
import * as deriveState from "./deriveState.js"
import * as deriveSubscribers from "./deriveSubscribers.js"
import * as bindEvents from "./bindEvents.js"

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

export function initialise(rootNode, subscribe, dispatch) {
  const state = {}
  const listKeys = {}

  cwalk(rootNode, (node) => {
    const listKey = node.getAttribute?.("x-list")
    if (listKey && !(listKey in listKeys)) {
      // @todo list updates should be registered on the parent as items can be removed
      deriveSubscribers.xList(listKey, node.parentNode, subscribe)
      deriveState.xList(node, state)
    }
    if (node.hasAttribute?.("x-input")) {
      deriveState.xInput(node, state)
      bindEvents.xInput(node, dispatch)
    }
    if (node.hasAttribute?.("x-on")) {
      bindEvents.xOn(rootNode, node, dispatch)
    }
    if (node.hasAttribute?.("x-node")) {
      deriveSubscribers.xNode(rootNode, node, subscribe)
    }
  })

  return state
}
