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

function getCollectionName(node) {
  const list = node.getAttribute("x-list")
  if (list) return ["x-list", list]
  const attr = node.getAttribute("x-attr")
  if (attr && attr.endsWith(".*")) return ["x-attr", attr]
  return []
}

export const xOn = (rootNode, node, dispatch) => {
  const [eventType, actionName] = node
    .getAttribute("x-on")
    .split(":")
    .map((v) => v.trim())

  node.addEventListener(eventType, (event) => {
    event.stopPropagation()

    const [k, v] = getCollectionName(node)

    const index = v?.endsWith(".*")
      ? findIndex(rootNode, event.target, `[${k}="${v}"]`)
      : null

    dispatch({
      type: actionName,
      event,
      index,
    })
  })
}
