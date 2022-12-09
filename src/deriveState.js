import { walk, cast, getValueAtPath } from "./helpers.js"
import { listSync } from "./list.js"
import { applyAttribute } from "./attribute.js"

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

function xList(node, state = {}) {
  let k = node.getAttribute(`x-list`)
  let v = Object.entries(node.dataset).reduce((o, [k, v]) => {
    o[k] = cast(v)
    return o
  }, {})

  state[k] = state[k] || []
  state[k].push(v)
}

function xInput(node, state = {}) {
  let k = node.getAttribute("name")
  if (!k) return state
  let v = cast(node.value)
  state[k] = v
}

function attributes(node) {
  return node.getAttributeNames().reduce((o, k) => {
    if (!k.startsWith("x-")) o[k] = node.getAttribute(k)
    return o
  }, {})
}

function xAttr(node, state = {}) {
  let k = node.getAttribute("x-attr")
  const v = attributes(node)
  if (k.endsWith(".*")) {
    k = k.slice(0, -2)
    state[k] = state[k] || []
    state[k].push(v)
  } else {
    state[k] = v
  }
}

export function deriveState(rootNode, state = {}) {
  cwalk(rootNode, (node) => {
    if (node.hasAttribute?.("x-list")) {
      xList(node, state)
    }
    if (node.hasAttribute?.("x-input")) {
      xInput(node, state)
    }
    if (node.hasAttribute?.("x-attr")) {
      xAttr(node, state)
    }
  })

  return state
}
