import {
  BINDING_ATTRIBUTE_NAME,
  BINDING_ATTRIBUTE_SELECTOR,
} from "./constants.js"

function cast(v) {
  if (!isNaN(v)) return +v
  return v
}

function getValue(key, node) {
  if (key.endsWith(".*")) {
    return Object.entries(node.dataset).reduce((o, [k, v]) => {
      o[k] = cast(v)
      return o
    }, {})
  }
  if (node.nodeName === "SELECT") {
    return cast(node.value)
  }
}

export function deriveState(node) {
  const elements = [...node.querySelectorAll(BINDING_ATTRIBUTE_SELECTOR)]

  const state = {}

  for (const element of elements) {
    let k = element.getAttribute(BINDING_ATTRIBUTE_NAME)
    let v = getValue(k, element)

    if (!k.endsWith(".*")) {
      state[k] = v
      continue
    }

    k = k.slice(0, -2)

    state[k] = state[k] || []
    state[k].push(v)
  }

  return state
}
