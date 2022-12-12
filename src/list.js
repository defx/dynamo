import { $$, cast } from "./helpers.js"

export const compareKeyedLists = (key, a = [], b = []) => {
  let delta = b.map(([k, item]) =>
    !key ? (k in a ? k : -1) : a.findIndex(([_, v]) => v[key] === item[key])
  )
  if (a.length !== b.length || !delta.every((a, b) => a === b)) return delta
}

export function listSync(rootNode, path, arr) {
  const nodes = $$(rootNode, `[x-node="${path}"]`)

  // check if anything has changed
  const nodeIds = nodes.map(({ id }) => id)
  const dataIds = arr.map(({ id }) => id)

  if (nodeIds.toString() === dataIds.toString()) return

  const removals = nodes.filter((node) => {
    const id = cast(node.id)
    return arr.find((datum) => datum.id === id) === false
  })
  removals.forEach((node) => node.remove())

  const [first, ...rest] = arr

  let t = nodes.find((node) => cast(node.id) === first.id)

  rest.forEach((datum) => {
    let node = nodes.find((node) => cast(node.id) === datum.id)
    if (node) {
      t.after(node)
      t = node
    }
  })
}
