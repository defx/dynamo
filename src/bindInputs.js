import {
  BINDING_ATTRIBUTE_NAME,
  BINDING_ATTRIBUTE_SELECTOR,
} from "./constants.js"

export function bindInputs(node, dispatch) {
  const nodes = [...node.querySelectorAll(BINDING_ATTRIBUTE_SELECTOR)].filter(
    (node) => ["SELECT"].includes(node.nodeName)
  )

  const events = {}

  for (const node of nodes) {
    const path = node.getAttribute(BINDING_ATTRIBUTE_NAME)

    node.addEventListener("input", () => {
      let value =
        node.getAttribute("type") === "checkbox" ? node.checked : node.value

      if (value.trim?.().length && !isNaN(value)) value = +value

      dispatch({
        type: "SET",
        payload: {
          name: path,
          value,
        },
      })
    })
  }

  return events
}
