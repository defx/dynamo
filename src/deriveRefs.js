function wrap(node, append) {
  return new Proxy(node, {
    get(_, prop) {
      if (prop === "append") {
        return append(node)
      }
      return Reflect.get(...arguments)
    },
  })
}

export function deriveRefs(rootNode, append) {
  return [...rootNode.querySelectorAll(`[x-ref]`)].reduce((o, el) => {
    o[el.getAttribute("x-ref")] = wrap(el, append)
    return o
  }, {})
}
