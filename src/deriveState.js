import { $$, cast } from "./helpers.js"

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

function xToggle(node, state = {}) {
  state.__xToggles__ = {}
  const toggles = $$(node, `[x-toggle]`)
  for (const toggle of toggles) {
    const id = toggle.getAttribute("x-toggle")
    const ariaExpanded = toggle.getAttribute("aria-expanded") === "true"
    state.__xToggles__[id] = ariaExpanded
  }
  return state
}

export function deriveState(node) {
  return {
    ...xList(node),
    ...xInput(node),
    ...xToggle(node),
  }
}
