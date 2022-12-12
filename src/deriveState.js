import { cast } from "./helpers.js"
import * as xo from "./xo.js"

export function xInput(node, state = {}) {
  let k = node.getAttribute("name")
  if (!k) return state
  let v = cast(node.value)
  state[k] = v
}

export function xNode(node, state = {}) {
  let k = node.getAttribute("x-node")
  const v = xo.read(node)
  if (k.endsWith(".*")) {
    k = k.slice(0, -2)
    state[k] = state[k] || []
    state[k].push(v)
  } else {
    state[k] = v
  }
}
