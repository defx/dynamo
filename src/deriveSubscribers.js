import { getValueAtPath } from "./helpers.js"
import { listSync } from "./list.js"
import { applyAttribute } from "./attribute.js"
import * as xo from "./xo.js"

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

export function xClass(node, subscribers = []) {
  subscribers.push((state) => {
    const k = node.getAttribute("x-class")
    applyClasses(state[k], node)
  })
}

function applyAttributes(attrs, node) {
  for (const [name, value] of Object.entries(attrs || {}))
    applyAttribute(node, name, value)
}

export function xAttr(node, subscribers = []) {
  subscribers.push((state, config) => {
    let k = node.getAttribute("x-attr")
    let index

    if (k.endsWith(".*")) {
      const collection = [
        ...node.parentNode.querySelectorAll(`[x-attr="${k}"]`),
      ]
      index = collection.findIndex((n) => n === node)
      k = k.slice(0, -2)
    }

    const fn = config["x-attr"]?.[k]

    if (fn) applyAttributes(fn(state, xo.read(node), index), node)
  })
}

export function xList(node, listSubscribers = {}) {
  const k = node.getAttribute(`x-list`)

  const { id } = node.dataset

  if (!id) {
    console.warn(
      `list node with no data-id attribute. any changes to state will not be reflected in the DOM`,
      node
    )
    return
  }

  listSubscribers[k] = (state) => {
    listSync(node.parentNode, k, state[k])
  }
}
