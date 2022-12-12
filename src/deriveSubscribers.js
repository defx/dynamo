import { getValueAtPath } from "./helpers.js"
import { listSync } from "./list.js"
import * as xo from "./xo.js"

export function xNode(node, subscribers = [], listSubscribers = {}, refs = {}) {
  const k = node.getAttribute(`x-node`)
  const _k = k.replace(/\.\*$/, "")

  if (k.endsWith(".*") && !(k in listSubscribers)) {
    listSubscribers[k] = (state) => {
      listSync(node.parentNode, k, state[_k])
    }
  }

  if (!(_k in refs)) {
    Object.defineProperty(refs, _k, {
      get() {
        const x = [...node.parentNode.querySelectorAll(`[x-node="${k}"]`)]
        return k === _k ? x[0] : x
      },
    })
  }

  subscribers.push((state) => {
    let rk = k

    if (k.endsWith(".*")) {
      const collection = [
        ...node.parentNode.querySelectorAll(`[x-node="${k}"]`),
      ]
      const index = collection.findIndex((n) => n === node)
      rk = _k + `.${index}`
    }

    xo.write(node, getValueAtPath(rk, state))
  })
}
