function findIndex(rootNode, node, query) {
  const collection = [...rootNode.querySelectorAll(query)]
  return collection.findIndex((n) => n === node)
}

export const xOn = (node, dispatch) => {
  const [eventType, actionName] = node
    .getAttribute("x-e")
    .split(":")
    .map((v) => v.trim())

  node.addEventListener(eventType, (event) => {
    event.stopPropagation()

    const k = event.target.getAttribute("x-node") || ""

    const index = k.endsWith(".*")
      ? findIndex(node.parentNode, event.target, `[x-node="${k}"]`)
      : null

    dispatch({
      type: actionName,
      event,
      index,
    })
  })
}
