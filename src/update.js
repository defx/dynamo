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
      deriveSubscribers.xList(rootNode, node, listSubscribers)
      deriveState.xList(node, state)
    }
    if (node.hasAttribute?.("x-input")) {
      deriveState.xInput(node, state)
      bindEvents.xInput(node, dispatch)
    }
    // if (node.hasAttribute?.("x-attr")) {
    //   deriveSubscribers.xAttr(rootNode, node, subscribers)
    // }
    if (node.hasAttribute?.("x-on")) {
      bindEvents.xOn(rootNode, node, dispatch)
    }
    // if (node.hasAttribute?.("x-class")) {
    //   deriveSubscribers.xClass(rootNode, node, subscribers)
    // }
    if (node.hasAttribute?.("x-node")) {
      deriveSubscribers.xNode(rootNode, node, subscribers)
    }
  })

  return state
}
