import { $$ } from "./helpers.js"

function cast(v) {
  if (!isNaN(v)) return +v
  return v
}

function xList(node, state = {}) {
  const elements = $$(node, `[x-list]`)
  for (const element of elements) {
    let k = element.getAttribute(`x-list`)
    let v = Object.entries(element.dataset).reduce((o, [k, v]) => {
      o[k] = cast(v)
      return o
    }, {})

    state[k] = state[k] || []
    state[k].push(v)
  }

  return state
}

function xInput(node, state = {}) {
  const elements = $$(node, `[x-input]`)
  for (const element of elements) {
    let k = element.getAttribute("name")
    if (!k) continue
    let v = cast(element.value)
    state[k] = v
  }

  return state
}

export function deriveState(node) {
  return xList(node, xInput(node))
}
