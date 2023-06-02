export const last = (v = []) => v[v.length - 1]

export const isWhitespace = (node) => {
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

const getTarget = (path, target) => {
  let parts = path.split(".")
  let t =
    parts.slice(0, -1).reduce((o, k) => {
      return o && o[k]
    }, target) || target
  return [t, last(parts)]
}

export const getValueAtPath = (path, target) => {
  let [a, b] = getTarget(path, target)

  let v = a?.[b]
  if (typeof v === "function") return v.bind(a)
  return v
}

export const setValueAtPath = (path, value, target) => {
  let [a, b] = getTarget(path, target)
  return (a[b] = value)
}

export const serializable = (o) => JSON.parse(JSON.stringify(o))

export function cast(v) {
  return isNaN(v) ? v : +v
}

export function castAll(o) {
  return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, cast(v)]))
}

export const isPrimitive = (v) => v === null || typeof v !== "object"

export const typeOf = (v) =>
  Object.prototype.toString.call(v).match(/\s(.+[^\]])/)[1]

export const findIndex = (node, query) => {
  const collection = [...rootNode.querySelectorAll(query)]
  return collection.findIndex((n) => n === node)
}
