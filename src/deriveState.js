import { cast, castAll } from "./helpers.js"

export function xInput(node, state = {}) {
  let k = node.getAttribute("name")
  if (!k) return state
  let v = cast(node.value)
  state[k] = v
}

export function xList(node, state = {}) {
  let k = node.getAttribute("x-each")
  if (!k) return state

  state[k] = state[k] || []
  state[k].push({
    id: node.id,
    ...castAll(node.dataset),
  })
}
