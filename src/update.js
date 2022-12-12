import { walk } from "./helpers.js"
import * as deriveState from "./deriveState.js"
import * as deriveSubscribers from "./deriveSubscribers.js"
import * as bindEvents from "./bindEvents.js"

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
  dispatch,
  refs = {}
) {
  cwalk(rootNode, (node) => {
    if (node.hasAttribute?.("x-e")) {
      bindEvents.xOn(node, dispatch)
    }
    if (node.hasAttribute?.("x-node")) {
      deriveState.xNode(node, state)
      deriveSubscribers.xNode(
        node,
        subscribers,
        listSubscribers,
        refs,
        dispatch
      )
    }
  })

  return state
}
