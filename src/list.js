import { $$, cast } from "./helpers.js"

export const compareKeyedLists = (key, a = [], b = []) => {
  let delta = b.map(([k, item]) =>
    !key ? (k in a ? k : -1) : a.findIndex(([_, v]) => v[key] === item[key])
  )
  if (a.length !== b.length || !delta.every((a, b) => a === b)) return delta
}

/* @todo: handle multiple lists bound to the same property */
/* is .after a no-op if the element is already the nextSibling? */
export function xlistSync(rootNode, path, arr) {
  const nodes = $$(rootNode, `[x-list="${path}"]`)

  // check if anything has changed
  const nodeIds = nodes.map(({ dataset: { id } }) => id)
  const dataIds = arr.map(({ id }) => id)

  if (nodeIds.toString() === dataIds.toString()) return

  const removals = nodes.filter((node) => {
    const id = cast(node.dataset.id)
    return arr.find((datum) => datum.id === id) === false
  })
  removals.forEach((node) => node.remove())

  const [first, ...rest] = arr

  let t = nodes.find((node) => cast(node.dataset.id) === first.id)

  rest.forEach((datum) => {
    let node = nodes.find((node) => cast(node.dataset.id) === datum.id)
    if (node) {
      t.after(node)
      t = node
    }
  })
}

export function listSync(nodes, curr, next) {
  // check if anything has changed
  const currIds = curr.map(({ id }) => id)
  const nextIds = next.map(({ id }) => id)

  if (currIds.toString() === nextIds.toString()) return

  // removals
  curr
    .filter((c) => {
      return next.find((n) => c.id === n.id) === false
    })
    .forEach(({ id }) => nodes.find((node) => node.id === id)?.remove())

  const [first, ...rest] = next

  let t = nodes.find((node) => node.id === first.id)

  rest.forEach((d) => {
    let node = nodes.find((node) => node.id === d.id)
    if (node) {
      if (t.nextElementSibling !== node) {
        // is t.after already a no-op in this case?
        t.after(node)
      }
      t = node
    }
  })
}
