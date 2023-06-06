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

export const xOn = (rootNode, node, dispatch) => {
  const attrValue = node.getAttribute("x-on")
  const [eventType, k] = attrValue.split(":").map((v) => v.trim())

  node.addEventListener(eventType, (event) => {
    event.stopPropagation()

    let index
    let type = k

    const collection = [...rootNode.querySelectorAll(`[x-on="${attrValue}"]`)]
    index = collection.findIndex((n) => n === node)

    const action = {
      type,
      event,
      index,
    }

    if (eventType === "submit" && node.nodeName === "FORM") {
      action.payload = Object.fromEntries(new FormData(node))
    }

    dispatch(action)
  })
}
