import { $$ } from "./helpers.js"

function applyClasses(o, node) {
  if (!o) return
  Object.keys(o).forEach((name) => {
    if (o[name]) {
      node.classList.add(name)
    } else {
      node.classList.remove(name)
    }
  })
}

export function bindClasses(rootNode) {
  return (state) => {
    const nodes = $$(rootNode, `[x-class]`)

    if (!nodes.length) return

    for (const node of nodes) {
      const k = node.getAttribute("x-class")
      applyClasses(state[k], node)
    }
  }
}
