import { listSync } from "./list.js"
import * as xo from "./xo.js"

function apply(o, node) {
  Object.entries(o).forEach(([k, v]) => {
    // console.log("apply", { k, v })

    switch (k) {
      case "class": {
        node.setAttribute("class", xo.objectToClasses(v))
        break
      }
      case "style": {
        break
      }
      case "textContent": {
        node.textContent = v
        break
      }
      default: {
        xo.write(node, { [k]: v })
        break
      }
    }
  })
}

export function xNode(rootNode, node, subscribers = []) {
  const callback = (state, config) => {
    let k = node.getAttribute("x-node")

    let index
    if (k.endsWith(".*")) {
      const collection = [...rootNode.querySelectorAll(`[x-node="${k}"]`)]
      index = collection.findIndex((n) => n === node)
      k = k.slice(0, -2)
    }

    const fn = config.node?.[k]

    // console.log("callback", { k, fn })

    if (!fn) return

    const props = fn(state, index)

    apply(props, node)
  }
  subscribers.push(callback)
}

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

export function xList(_, node, listSubscribers = {}) {
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
