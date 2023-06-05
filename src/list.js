// @todo: understand what happens when there's no node.id

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

  // @todo: check if template is required + present

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
