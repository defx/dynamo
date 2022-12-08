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

function attributes(node) {
  return node.getAttributeNames().reduce((o, k) => {
    if (!k.startsWith("x-")) o[k] = node.getAttribute(k)
    return o
  }, {})
}

function xAttr(node, state = {}) {
  const elements = $$(node, `[x-attr]`)
  for (const element of elements) {
    let k = element.getAttribute("x-attr")
    const v = attributes(element)
    if (k.endsWith(".*")) {
      k = k.slice(0, -2)
      state[k] = state[k] || []
      state[k].push(v)
    } else {
      state[k] = v
    }
  }
  return state
}

export function deriveState(node) {
  return {
    ...xList(node),
    ...xInput(node),
    ...xAttr(node),
  }
}
