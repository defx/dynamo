export const xInput = (node, dispatch) => {
  const name = node.getAttribute(`name`)

  if (!name) {
    console.warn(`Missing name attribute on x-control`, node)
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
  const attr = node.getAttribute("x-node")
  if (attr && attr.endsWith(".*")) return ["x-node", attr]
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

    const action = {
      type: actionName,
      event,
      index,
    }

    if (eventType === "submit" && node.nodeName === "FORM") {
      action.payload = Object.fromEntries(new FormData(node))
    }

    dispatch(action)
  })
}
