import { getValueAtPath } from "./helpers.js"
import { listSync } from "./list.js"
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

export function xAttr(node, subscribers = []) {
  subscribers.push((state, config) => {
    let k = node.getAttribute("x-attr")
    let index

    if (k.endsWith(".*")) {
      // @todo: cache these queries per xAttr invocation

      const collection = [
        ...node.parentNode.querySelectorAll(`[x-attr="${k}"]`),
      ]
      index = collection.findIndex((n) => n === node)
      k = k.slice(0, -2)
    }

    const fn = config.attributes?.[k]

    if (fn) xo.write(node, fn(state, xo.read(node), index))
  })
}

export function xList(node, listSubscribers = {}) {
  const k = node.getAttribute(`x-list`)

  const { id } = node

  if (!id) {
    console.warn(
      `list node with no id attribute. any changes to state will not be reflected in the DOM`,
      node
    )
    return
  }

  listSubscribers[k] = (state, config) => {
    const fn = config.lists?.[k]

    if (fn) {
      const listNodes = [...node.parentNode.querySelectorAll(`[x-list="${k}"]`)]
      const listData = listNodes.map((node) => ({
        id: node.id,
        ...node.dataset,
      }))
      listSync(listNodes, listData, fn(state, listData.slice(0)))
    }
  }
}
