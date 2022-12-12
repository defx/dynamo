import { cast } from "./helpers.js"

export function xList(node, state = {}) {
  let k = node.getAttribute(`x-list`)
  let v = Object.entries(node.dataset).reduce((o, [k, v]) => {
    o[k] = cast(v)
    return o
  }, {})

  state[k] = state[k] || []
  state[k].push(v)
}

export function xInput(node, state = {}) {
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

const getAttributes = (node) => {
  return node.getAttributeNames().reduce(
    (o, k) => {
      if (k.startsWith("x-") || k.startsWith("data-")) return o

      o[k] = node.getAttribute(k)
      return o
    },
    {
      dataset: Object.entries(node.dataset).reduce((o, [k, v]) => {
        o[k] = cast(v)
        return o
      }, {}),
    }
  )
}

export function xAttr(node, state = {}) {
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

export function xNode(node, state = {}) {
  let k = node.getAttribute("x-node")
  const v = getAttributes(node)
  if (k.endsWith(".*")) {
    k = k.slice(0, -2)
    state[k] = state[k] || []
    state[k].push(v)
  } else {
    state[k] = v
  }
}
