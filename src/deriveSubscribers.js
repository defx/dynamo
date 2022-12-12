import { getValueAtPath } from "./helpers.js"
import { listSync } from "./list.js"
import * as xo from "./xo.js"

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

    xo.write(node, getValueAtPath(rk, state))
  })
}
