import { castAll } from "./helpers.js"

export function listItems(listContainerNode) {
  return [...listContainerNode.children].filter((node) =>
    node.matches(`[x-list-item]`)
  )
}

export function listData(listItems) {
  return listItems.map((node) => ({
    id: node.id,
    ...castAll(node.dataset),
  }))
}

export function listSync(nodes, curr, next, template) {
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

  if (
    !template &&
    next.find((c) => {
      return curr.find((n) => c.id === n.id) === false
    })
  ) {
    console.error(`Missing template when trying to add items to a list`)
    return
  }

  if (!t) {
    t = nodeFromString(template(first))
    nodes[0].before(t)
  }

  rest.forEach((d) => {
    let node =
      nodes.find((node) => node.id === d.id) || nodeFromString(template(d))

    if (node) {
      if (t.nextElementSibling !== node) {
        // is t.after already a no-op in this case?
        t.after(node)
      }
      t = node
    }
  })
}
