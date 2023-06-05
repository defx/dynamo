export const last = (v = []) => v[v.length - 1]

const isWhitespace = (node) => {
  return node.nodeType === node.TEXT_NODE && node.nodeValue.trim() === ""
}

export const walk = (node, callback, deep = true) => {
  if (!node) return

  if (!isWhitespace(node)) {
    let v = callback(node)
    if (v === false) return
    if (v?.nodeName) return walk(v, callback, deep)
  }
  if (deep) walk(node.firstChild, callback, deep)
  walk(node.nextSibling, callback, deep)
}

export const serializable = (o) => JSON.parse(JSON.stringify(o))

export function cast(v) {
  return isNaN(v) ? v : +v
}

export const isPrimitive = (v) => v === null || typeof v !== "object"

export const typeOf = (v) =>
  Object.prototype.toString.call(v).match(/\s(.+[^\]])/)[1]

export const findIndex = (node, query) => {
  const collection = [...rootNode.querySelectorAll(query)]
  return collection.findIndex((n) => n === node)
}
