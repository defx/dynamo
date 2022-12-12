import { cast, isPrimitive } from "./helpers.js"

const pascalToKebab = (string) =>
  string.replace(/[\w]([A-Z])/g, function (m) {
    return m[0] + "-" + m[1].toLowerCase()
  })

const kebabToPascal = (string) =>
  string.replace(/[\w]-([\w])/g, function (m) {
    return m[0] + m[2].toUpperCase()
  })

function aria(v) {
  if (v === "true") return true
  if (v === "false") return false
  return v
}

const inputElements = ["INPUT", "TEXTAREA", "SELECT"]

export const read = (node) => {
  const attrs = node.getAttributeNames().reduce((o, k) => {
    if (k.startsWith("x-") || k.startsWith("data-")) return o

    let v = node.getAttribute(k)

    if (k.startsWith("aria-")) {
      v = aria(v)
    }

    if (k === "class") {
      v = v.split(/\n/).reduce((o, k) => {
        o[k] = true
        return o
      }, {})
    }

    o[pascalToKebab(k)] = v

    return o
  }, {})
  const dataset = Object.entries(node.dataset).reduce((o, [k, v]) => {
    o[k] = cast(v)
    return o
  }, {})

  const rv = {
    ...attrs,
    dataset,
  }

  if (inputElements.includes(node.nodeName)) {
    rv.value = node.value
  }

  return rv
}

export const write = (node, attrs) => {
  for (let [k, v] of Object.entries(attrs || {})) {
    k = pascalToKebab(k)

    if (k === "value" && inputElements.includes(node.nodeName)) {
      continue
    }

    if (k === "class") {
      v = Object.entries(v)
        .reduce((o, [k, v]) => {
          if (v) o.push(k)
          return o
        }, [])
        .join(" ")
    }

    if (typeof v === "boolean") {
      if (k.startsWith("aria-")) {
        v = "" + v
      } else if (v) {
        v = ""
      }
    }

    if (isPrimitive(v) === false) {
      if (k === "dataset") {
        // top-level dataset is read-only
        Object.entries(v).forEach(([k, v]) => (node.dataset[k] = v))
        continue
      } else {
        node[kebabToPascal(k)] = v
      }
    }

    let current = node.getAttribute(k)

    if (v === current) continue

    if (typeof v === "string" || typeof v === "number") {
      node.setAttribute(k, v)
    } else {
      node.removeAttribute(k)
    }
  }
  return node
}
