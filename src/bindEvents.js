export const xInput = (node, dispatch) => {
  const name = node.getAttribute(`name`)

  if (!name) {
    console.warn(`Missing name attribute on x-input`, node)
    return
  }

  node.addEventListener("input", () => {
    let value =
      node.getAttribute("type") === "checkbox" ? node.checked : node.value

    if (value.trim?.().length && !isNaN(value)) value = +value

    dispatch({
      type: "MERGE",
      payload: {
        [name]: value,
      },
    })
  })
}

function findIndex(rootNode, node, query) {
  const collection = [...rootNode.querySelectorAll(query)]
  return collection.findIndex((n) => n === node)
}

export const xOn = (node, dispatch) => {
  const [eventType, actionName] = node
    .getAttribute("x-on")
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
