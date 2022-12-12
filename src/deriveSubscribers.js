import { getValueAtPath, setValueAtPath } from "./helpers.js"
import { listSync } from "./list.js"
import * as xo from "./xo.js"

const inputElements = ["INPUT", "TEXTAREA", "SELECT"]

export function xNode(
  node,
  subscribers = [],
  listSubscribers = {},
  refs = {},
  dispatch
) {
  const k = node.getAttribute(`x-o`)
  const _k = k.replace(/\.\*$/, "")

  if (k.endsWith(".*") && !(k in listSubscribers)) {
    listSubscribers[k] = (state) => {
      listSync(node.parentNode, k, state[_k])
    }
  }

  if (!(_k in refs)) {
    Object.defineProperty(refs, _k, {
      get() {
        const x = [...node.parentNode.querySelectorAll(`[x-o="${k}"]`)]
        return k === _k ? x[0] : x
      },
    })
  }

  subscribers.push((state) => {
    let rk = k

    if (k.endsWith(".*")) {
      const collection = [...node.parentNode.querySelectorAll(`[x-o="${k}"]`)]
      const index = collection.findIndex((n) => n === node)
      rk = _k + `.${index}`
    }

    xo.write(node, getValueAtPath(rk, state))
  })

  if (inputElements.includes(node.nodeName)) {
    node.addEventListener("input", () => {
      let payload = {}
      let rk = _k
      let value =
        node.getAttribute("type") === "checkbox" ? node.checked : node.value

      if (value.trim?.().length && !isNaN(value)) value = +value

      if (k.endsWith(".*")) {
        const collection = [...node.parentNode.querySelectorAll(`[x-o="${k}"]`)]
        const index = collection.findIndex((n) => n === node)
        rk = _k + `.${index}`
      }

      setValueAtPath(rk, { value }, payload)

      dispatch({
        type: "MERGE",
        payload,
      })
    })
  }
}
