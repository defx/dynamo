import { $$, getValueAtPath, findIndex } from "./helpers.js"
import { listSync } from "./list.js"
import { applyAttribute } from "./attribute.js"

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

function xClass(rootNode) {
  return [
    (state) => {
      const nodes = $$(rootNode, `[x-class]`)

      if (!nodes.length) return

      for (const node of nodes) {
        const k = node.getAttribute("x-class")
        applyClasses(state[k], node)
      }
    },
  ]
}

function applyAttributes(attrs, node) {
  for (const [name, value] of Object.entries(attrs || {}))
    applyAttribute(node, name, value)
}

function xAttr(rootNode) {
  return [
    (state) => {
      const nodes = $$(rootNode, `[x-attr]`)

      if (!nodes.length) return

      for (const node of nodes) {
        let k = node.getAttribute("x-attr")

        if (k.endsWith(".*")) {
          const collection = [...rootNode.querySelectorAll(`[x-attr="${k}"]`)]
          const index = collection.findIndex((n) => n === node)
          k = k.slice(0, -2) + `.${index}`
        }

        applyAttributes(getValueAtPath(k, state), node)
      }
    },
  ]
}

function xList(rootNode) {
  const nodes = $$(rootNode, `[x-list]`)

  const byPath = {}

  for (const node of nodes) {
    const k = node.getAttribute(`x-list`)

    const { id } = node.dataset

    if (!id) {
      console.warn(
        `list node with no data-id attribute. any changes to state will not be reflected in the DOM`,
        node
      )
      continue
    }

    byPath[k] = (state) => {
      listSync(rootNode, k, state[k])
    }
  }

  return Object.values(byPath)
}

function xToggle(rootNode) {
  const subscriptions = []

  $$(rootNode, `[x-toggle]`).forEach((node) => {
    const id = node.getAttribute(`x-toggle`)
    if (!id) return
    const target = rootNode.querySelector(`#${id}`)
    if (!target) return
    subscriptions.push((state) => {
      const expanded = state.__xToggles__?.[id] || false
      node.setAttribute("aria-expanded", expanded)
    })
  })
  return subscriptions
}

export function deriveSubscribers(rootNode) {
  return [
    xList(rootNode),
    xToggle(rootNode),
    xClass(rootNode),
    xAttr(rootNode),
  ].flat()
}
