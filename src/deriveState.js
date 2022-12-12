import * as xo from "./xo.js"

export function xNode(node, state = {}) {
  let k = node.getAttribute("x-o")
  const v = xo.read(node)
  if (k.endsWith(".*")) {
    k = k.slice(0, -2)
    state[k] = state[k] || []
    state[k].push(v)
  } else {
    state[k] = v
  }
}
