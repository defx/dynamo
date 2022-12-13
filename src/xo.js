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
  return node.getAttributeNames().reduce((o, k) => {
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
}

export const write = (node, attrs) => {
  for (let [k, v] of Object.entries(attrs || {})) {
    k = pascalToKebab(k)

    if (k === "value" && inputElements.includes(node.nodeName)) {
      if (v !== node.value) node.value = v
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
        // @todo: check for removals
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