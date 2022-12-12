import { getValueAtPath } from "./helpers.js"
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
  subscribers.push((state) => {
    let k = node.getAttribute("x-attr")

    if (k.endsWith(".*")) {
      const collection = [
        ...node.parentNode.querySelectorAll(`[x-attr="${k}"]`),
      ]
      const index = collection.findIndex((n) => n === node)
      k = k.slice(0, -2) + `.${index}`
    }

    applyAttributes(getValueAtPath(k, state), node)
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

export function xNode(node, subscribers = [], listSubscribers = {}) {
  const k = node.getAttribute(`x-node`)

  if (k.endsWith(".*") && !(k in listSubscribers)) {
    listSubscribers[k] = (state) => {
      listSync(node.parentNode, k, state[k.slice(0, -2)])
    }
  }

  subscribers.push((state) => {
    let rk = k

    if (k.endsWith(".*")) {
      const collection = [
        ...node.parentNode.querySelectorAll(`[x-node="${k}"]`),
      ]
      const index = collection.findIndex((n) => n === node)
      rk = k.slice(0, -2) + `.${index}`
    }

    applyAttributes(getValueAtPath(rk, state), node)
  })
}
