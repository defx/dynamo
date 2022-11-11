export function bindEvents(events, dispatch) {
  for (const eventType in events) {
    for (const { node, path } of events[eventType]) {
      node.addEventListener(eventType, () => {
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
  }
}
