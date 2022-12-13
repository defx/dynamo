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

export function update(
  rootNode,
  state = {},
  subscribers = [],
  listSubscribers = {},
  dispatch
) {
  cwalk(rootNode, (node) => {
    if (node.hasAttribute?.("x-list")) {
      deriveState.xList(node, state)
      deriveSubscribers.xList(node, listSubscribers)
    }
    if (node.hasAttribute?.("x-input")) {
      deriveState.xInput(node, state)
      bindEvents.xInput(node, dispatch)
    }
    if (node.hasAttribute?.("x-attr")) {
      deriveState.xAttr(node, state)
      deriveSubscribers.xAttr(node, subscribers)
    }
    if (node.hasAttribute?.("x-class")) {
      deriveSubscribers.xClass(node, subscribers)
    }
    if (node.hasAttribute?.("x-on")) {
      bindEvents.xOn(node, dispatch)
    }
  })

  return state
}
