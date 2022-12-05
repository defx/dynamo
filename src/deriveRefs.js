import { $$ } from "./helpers.js"

export function deriveRefs(rootNode) {
  return $$(rootNode, `[x-ref]`).reduce((o, el) => {
    o[el.getAttribute("x-ref")] = el
    return o
  }, {})
}
