import { cast } from "./helpers.js"

export function xInput(node, state = {}) {
  let k = node.getAttribute("name")
  if (!k) return state
  let v = cast(node.value)
  state[k] = v
}
