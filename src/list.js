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
