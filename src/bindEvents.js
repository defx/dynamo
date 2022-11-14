export function bindEvents(node, dispatch) {
  const nodes = [...node.querySelectorAll(`[x-onclick]`)]

  for (const node of nodes) {
    const actionName = node.getAttribute("x-onclick")

    node.addEventListener("click", (event) => {
      dispatch({
        type: actionName,
        payload: {
          event,
        },
      })
    })
  }
}
