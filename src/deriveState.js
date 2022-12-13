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
