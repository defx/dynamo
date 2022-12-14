import { listSync } from "./list.js"
import * as xo from "./xo.js"

export function xClass(rootNode, node, subscribers = []) {
  subscribers.push((state, config) => {
    const k = node.getAttribute("x-class")
    const fn = config.classes?.[k]

    if (fn) {
      let index
      if (k.endsWith(".*")) {
        const collection = [...rootNode.querySelectorAll(`[x-class="${k}"]`)]
        index = collection.findIndex((n) => n === node)
      }

      node.setAttribute(
        "class",
        xo.objectToClasses(
          fn(
            state,
            xo.objectFromClasses(node.getAttribute("class") || ""),
            index
          )
        )
      )
    }
  })
}

export function xAttr(rootNode, node, subscribers = []) {
  subscribers.push((state, config) => {
    let k = node.getAttribute("x-attr")
    let index

    if (k.endsWith(".*")) {
      // @todo: cache these queries per xAttr invocation

      const collection = [...rootNode.querySelectorAll(`[x-attr="${k}"]`)]
      index = collection.findIndex((n) => n === node)
      k = k.slice(0, -2)
    }

    const fn = config.attributes?.[k]

    if (fn) xo.write(node, fn(state, xo.read(node), index))
  })
}

export function xList(rootNode, node, listSubscribers = {}) {
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
      const listNodes = [...rootNode.querySelectorAll(`[x-list="${k}"]`)]
      const listData = listNodes.map((node) => ({
        id: node.id,
        ...node.dataset,
      }))

      listSync(listNodes, listData, fn(state, listData.slice(0)))
    }
  }
}
