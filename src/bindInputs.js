export function bindInputs(node, dispatch) {
  const nodes = [...node.querySelectorAll(`[x-input]`)].filter((node) =>
    ["SELECT"].includes(node.nodeName)
  )

  for (const node of nodes) {
    const name = node.getAttribute(`name`)

    if (!name) {
      console.warn(`Missing name attribute on x-input`, node)
      continue
    }

    node.addEventListener("input", () => {
      let value =
        node.getAttribute("type") === "checkbox" ? node.checked : node.value

      if (value.trim?.().length && !isNaN(value)) value = +value

      dispatch({
        type: "SET",
        payload: {
          name,
          value,
        },
      })
    })
  }
}
