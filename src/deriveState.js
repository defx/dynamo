import { cast } from "./helpers.js"
import * as xo from "./xo.js"

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

export function xAttr(node, state = {}) {
  let k = node.getAttribute("x-attr")
  const v = xo.read(node)
  if (k.endsWith(".*")) {
    k = k.slice(0, -2)
    state[k] = state[k] || []
    state[k].push(v)
  } else {
    state[k] = v
  }
}
