function debounce(fn) {
  let id
  return (...args) => {
    if (!id) {
      id = requestAnimationFrame(() => {
        fn(...args)
        id = null
      })
    }
  }
}

export function Store({
  action: actionHandlers = {},
  getState: getStateWrapper = (v) => v,
  onChangeCallback,
  api = {},
}) {
  let state

  const callback = debounce(() => onChangeCallback(getState()))

  function transition(o) {
    state = getStateWrapper({ ...o })
    callback()
  }

  function getState() {
    return { ...state }
  }

  function dispatch(type, action) {
    if (type in actionHandlers) {
      const x = actionHandlers[type](getState(), action)
      transition({ ...state, ...x })
    }
  }

  return {
    dispatch, // dispatch an action to the reducers
    getState, // optionally provide a wrapper function to derive additional properties in state
    setState: (fn) => {
      transition(fn(getState()))
    },
    ...api,
  }
}
